routerAdd(
  'POST',
  '/backend/v1/analyze/camada1',
  (e) => {
    const body = e.requestInfo().body || {}
    const oportunidadeId = body.oportunidade_id
    if (!oportunidadeId) return e.badRequestError('oportunidade_id é obrigatório')

    let opp
    try {
      opp = $app.findRecordById('oportunidades', oportunidadeId)
    } catch (_) {
      return e.notFoundError('oportunidade não encontrada')
    }

    let promptCamada1 = ''
    try {
      const configRecord = $app.findFirstRecordByData('config', 'chave', 'prompt_camada1')
      promptCamada1 = configRecord.getString('valor')
    } catch (_) {}
    if (!promptCamada1) {
      promptCamada1 =
        'Você é um analista sênior de licitações públicas brasileiras. Analise o edital e produza um parecer estruturado em JSON com: veredicto, score (0-100), resumo_simples, identificacao, objeto, itens, valores_prazos, compatibilidade, pontos_positivos, riscos, recomendacao.'
    }

    let documentText = ''
    try {
      const docs = $app.findRecordsByFilter(
        'documentos',
        'oportunidade_id = {:oppId}',
        '',
        50,
        0,
        oportunidadeId,
      )
      for (var i = 0; i < docs.length; i++) {
        documentText += '\n--- Documento: ' + docs[i].getString('nome_arquivo') + ' ---\n'
      }
    } catch (_) {}

    const oppInfo =
      'Título: ' +
      opp.getString('titulo') +
      '\nNúmero: ' +
      opp.getString('numero_edital') +
      '\nÓrgão: ' +
      opp.getString('orgao') +
      '\nModalidade: ' +
      opp.getString('modalidade')

    try {
      const reply = $ai.chat({
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
                'Sem documentos anexados - faça análise baseada nas informações disponíveis.'),
          },
        ],
      })

      const content = reply.choices[0].message.content

      const analisesCol = $app.findCollectionByNameOrId('analises')
      const analiseRecord = new Record(analisesCol)
      analiseRecord.set('oportunidade_id', oportunidadeId)
      analiseRecord.set('tipo', 'camada1')
      analiseRecord.set('json_resultado', content)
      $app.save(analiseRecord)

      try {
        const parsed = JSON.parse(content)
        opp.set('analysis', JSON.stringify(parsed))
        if (parsed.score) opp.set('score', parsed.score)
        if (parsed.veredicto) opp.set('verdict', parsed.veredicto)
        $app.save(opp)
      } catch (_) {}

      return e.json(200, { success: true, content: content })
    } catch (err) {
      if (err instanceof SkipAiConfigError)
        return e.json(503, { error: 'IA temporariamente indisponível' })
      if (err instanceof SkipAiError) return e.json(502, { error: 'Falha na chamada de IA' })
      throw err
    }
  },
  $apis.requireAuth(),
)
