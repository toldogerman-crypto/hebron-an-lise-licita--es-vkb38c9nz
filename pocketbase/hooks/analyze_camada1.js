routerAdd(
  'POST',
  '/backend/v1/analyze/camada1',
  (e) => {
    var body = e.requestInfo().body || {}
    var oportunidadeId = body.oportunidade_id
    if (!oportunidadeId) return e.badRequestError('oportunidade_id é obrigatório')

    var opp
    try {
      opp = $app.findRecordById('oportunidades', oportunidadeId)
    } catch (_) {
      return e.notFoundError('oportunidade não encontrada')
    }

    if (opp.getString('status') === 'em_analise') {
      return e.json(409, { error: 'Análise já em andamento' })
    }

    function setFalha(msg) {
      try {
        opp.set('status', 'falha_analise')
        opp.set('observations', msg)
        $app.save(opp)
      } catch (_) {}
    }

    try {
      opp.set('status', 'em_analise')
      $app.save(opp)
    } catch (_) {}

    var baseUrl = $secrets.get('PB_INSTANCE_URL') || ''
    var superuserToken = $secrets.get('PB_SUPERUSER_TOKEN') || ''

    var documentText = ''
    try {
      var docs = $app.findRecordsByFilter(
        'documentos',
        'oportunidade_id = {:oppId}',
        '-created',
        50,
        0,
        oportunidadeId,
      )
      for (var i = 0; i < docs.length; i++) {
        var arquivo = docs[i].getString('arquivo')
        if (!arquivo) continue
        documentText += '\n--- Documento: ' + docs[i].getString('nome_arquivo') + ' ---\n'
        if (baseUrl && superuserToken) {
          try {
            var fileRes = $http.send({
              url: baseUrl + '/api/files/documentos/' + docs[i].id + '/' + arquivo,
              method: 'GET',
              headers: { Authorization: superuserToken },
              timeout: 30,
            })
            if (fileRes.statusCode === 200 && fileRes.body) {
              var raw = new TextDecoder('utf-8', { fatal: false }).decode(fileRes.body)
              if (raw.indexOf('%PDF') === 0) {
                var extracted = ''
                var btMatch
                var btRe = /BT\s*([\s\S]*?)\s*ET/g
                while ((btMatch = btRe.exec(raw)) !== null) {
                  var pMatch
                  var pRe = /\(([^)]*)\)/g
                  while ((pMatch = pRe.exec(btMatch[1])) !== null) {
                    extracted += pMatch[1] + ' '
                  }
                }
                documentText += extracted || '[PDF binario - texto nao extraido automaticamente]'
              } else {
                documentText += raw
              }
            }
          } catch (_) {
            documentText += '[erro ao baixar arquivo]'
          }
        }
      }
    } catch (_) {}

    var perfilEmpresa = ''
    try {
      var perfilRecord = $app.findFirstRecordByData('config', 'chave', 'perfil_empresa')
      perfilEmpresa = perfilRecord.getString('valor')
    } catch (_) {}

    var promptCamada1 = ''
    try {
      var promptRecord = $app.findFirstRecordByData('config', 'chave', 'prompt_camada1')
      promptCamada1 = promptRecord.getString('valor')
    } catch (_) {}

    if (!promptCamada1) {
      promptCamada1 =
        'Você é um analista sênior de licitações públicas brasileiras. Analise o edital e produza um parecer estruturado em JSON.\n\n' +
        'EXTRAÇÃO PRIORITÁRIA (máxima precisão):\n' +
        '1. municipio_uf — Formato: "Cidade - UF" (ex: "Lages - SC")\n' +
        '2. modalidade — Modalidade da licitação\n' +
        '3. data_abertura — Formato: YYYY-MM-DD (ex: "2024-03-15"). Converta DD/MM/YYYY.\n' +
        '4. orgao — Órgão responsável\n' +
        '5. numero_edital — Número do edital\n\n' +
        'PERFIL DA EMPRESA:\n{{PERFIL_EMPRESA}}\n\n' +
        'REGRAS: NUNCA invente informação. Use "NÃO LOCALIZADO NO EDITAL" se não encontrar.\n\n' +
        'SISTEMA DE PONTUAÇÃO (0-100):\n' +
        '+20 CNAE compatível | +15 segmento prioritário | +10 ME/EPP\n' +
        '+10 sem atestado | +10 dispensa/cotação | +5 pregão eletrônico\n' +
        '+10 sem estoque | +5 ≤R$200k | +3 até R$500k | +5 sem garantia\n' +
        '+10 entrega remota/Sul | +5 outras regiões | +5 doc padrão\n\n' +
        'VEREDICTO: ≥70 "ENTRAR" | 45-69 "ANALISAR" | <45 "NÃO ENTRAR"\n' +
        'TRAVAS: CNAE incompatível, prazo vencido, atestado impossível, obras/combustíveis/medicamentos\n\n' +
        'RETORNE APENAS JSON com: veredicto, score, trava, resumo_simples, titulo, numero_edital, orgao, municipio_uf, modalidade, data_abertura, identificacao, objeto, itens, total_itens, valores_prazos, compatibilidade, fit_estrategico, beneficio_epp, local_entrega, pontos_positivos, riscos, glossario, recomendacao.'
    }

    if (perfilEmpresa) {
      promptCamada1 = promptCamada1.replace(/\{\{PERFIL_EMPRESA\}\}/g, perfilEmpresa)
    }

    var oppInfo =
      'Título: ' +
      opp.getString('titulo') +
      '\nNúmero: ' +
      opp.getString('numero_edital') +
      '\nÓrgão: ' +
      opp.getString('orgao') +
      '\nModalidade: ' +
      opp.getString('modalidade')

    function parseJson(content) {
      var cleaned = content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim()
      try {
        return JSON.parse(cleaned)
      } catch (_) {}
      var s = cleaned.indexOf('{')
      var en = cleaned.lastIndexOf('}')
      if (s !== -1 && en > s) {
        try {
          return JSON.parse(cleaned.substring(s, en + 1))
        } catch (_) {}
      }
      return null
    }

    function pad2(n) {
      n = String(n)
      return n.length < 2 ? '0' + n : n
    }

    function normalizeDate(value) {
      if (!value || typeof value !== 'string') return ''
      var trimmed = value.trim()
      if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        var m = trimmed.match(/(\d{4}-\d{2}-\d{2})/)
        return m ? m[1] : ''
      }
      var match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
      if (match) return match[3] + '-' + pad2(match[2]) + '-' + pad2(match[1])
      match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/)
      if (match) return '20' + match[3] + '-' + pad2(match[2]) + '-' + pad2(match[1])
      match = trimmed.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
      if (match) return match[3] + '-' + pad2(match[2]) + '-' + pad2(match[1])
      var months = {
        janeiro: '01',
        fevereiro: '02',
        marco: '03',
        março: '03',
        abril: '04',
        maio: '05',
        junho: '06',
        julho: '07',
        agosto: '08',
        setembro: '09',
        outubro: '10',
        novembro: '11',
        dezembro: '12',
      }
      match = trimmed.match(/(\d{1,2})\s+de\s+([a-zA-Zç]+)\s+de\s+(\d{4})/i)
      if (match) {
        var mn = match[2].toLowerCase()
        if (months[mn]) return match[3] + '-' + months[mn] + '-' + pad2(match[1])
      }
      return ''
    }

    function normalizeMunicipioUf(value) {
      if (!value || typeof value !== 'string') return ''
      var trimmed = value.trim()
      if (/^.+\s-\s[A-Z]{2}$/.test(trimmed)) return trimmed
      var match = trimmed.match(/^(.+?)\s*\/\s*([A-Z]{2})$/)
      if (match) return match[1].trim() + ' - ' + match[2].trim()
      match = trimmed.match(/^(.+?)\s*,\s*([A-Z]{2})$/)
      if (match) return match[1].trim() + ' - ' + match[2].trim()
      match = trimmed.match(/^(.+?)\s+([A-Z]{2})$/)
      if (match) return match[1].trim() + ' - ' + match[2].trim()
      return trimmed
    }

    try {
      var reply = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: promptCamada1 },
          {
            role: 'user',
            content:
              'Analise esta oportunidade:\n' +
              oppInfo +
              '\n\nDocumentos:\n' +
              (documentText ||
                'Sem documentos anexados - faça análise baseada nas informações disponíveis.') +
              '\n\nPRIORIDADE: Extraia com máxima precisão: municipio_uf (formato "Cidade - UF"), modalidade, data_abertura (formato YYYY-MM-DD), orgao e numero_edital.' +
              '\n\nIMPORTANTE: Retorne APENAS o JSON, sem markdown ou texto adicional.',
          },
        ],
      })

      var content = reply.choices[0].message.content
      var parsed = parseJson(content)

      if (!parsed) {
        reply = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: promptCamada1 },
            {
              role: 'user',
              content: 'Analise:\n' + oppInfo + '\n\nDocumentos:\n' + (documentText || 'N/A'),
            },
            { role: 'assistant', content: content },
            {
              role: 'user',
              content:
                'Sua resposta anterior não é um JSON válido. Retorne APENAS o JSON, sem markdown ou texto adicional.',
            },
          ],
        })
        content = reply.choices[0].message.content
        parsed = parseJson(content)
      }

      if (!parsed) {
        setFalha('Falha ao parsear resposta da IA após retry.')
        return e.json(500, { error: 'Falha ao parsear JSON da IA' })
      }

      var analisesCol = $app.findCollectionByNameOrId('analises')
      var analiseRecord = new Record(analisesCol)
      analiseRecord.set('oportunidade_id', oportunidadeId)
      analiseRecord.set('tipo', 'camada1')
      analiseRecord.set('json_resultado', content)
      $app.save(analiseRecord)

      if (parsed.municipio_uf) {
        parsed.municipio_uf = normalizeMunicipioUf(parsed.municipio_uf)
      }
      if (parsed.data_abertura) {
        var normalizedDate = normalizeDate(parsed.data_abertura)
        if (normalizedDate) {
          parsed.data_abertura = normalizedDate
        }
      }

      opp.set('analysis', parsed)
      if (parsed.score !== undefined) opp.set('score', parsed.score)
      if (parsed.veredicto) opp.set('verdict', parsed.veredicto)
      if (parsed.titulo) opp.set('titulo', parsed.titulo)
      if (parsed.numero_edital) opp.set('numero_edital', parsed.numero_edital)
      if (parsed.orgao) opp.set('orgao', parsed.orgao)
      if (parsed.municipio_uf) opp.set('municipio_uf', parsed.municipio_uf)
      if (parsed.modalidade) opp.set('modalidade', parsed.modalidade)
      if (parsed.data_abertura) opp.set('data_abertura', parsed.data_abertura)
      opp.set('status', 'aguardando_decisao')
      $app.save(opp)

      return e.json(200, { success: true, content: content })
    } catch (err) {
      var errMsg = 'Erro desconhecido'
      if (err && err.message) errMsg = err.message
      if (err instanceof SkipAiConfigError) errMsg = 'IA temporariamente indisponível'
      if (err instanceof SkipAiError) errMsg = 'Falha na chamada de IA'
      setFalha(errMsg)
      if (err instanceof SkipAiConfigError) return e.json(503, { error: errMsg })
      if (err instanceof SkipAiError) return e.json(502, { error: errMsg })
      throw err
    }
  },
  $apis.requireAuth(),
)
