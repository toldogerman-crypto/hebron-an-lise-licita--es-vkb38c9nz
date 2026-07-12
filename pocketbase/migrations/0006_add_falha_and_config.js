migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('oportunidades')
    var newFields = []
    for (var i = 0; i < col.fields.length; i++) {
      var f = col.fields[i]
      if (f.name === 'status') {
        newFields.push({
          name: 'status',
          type: 'select',
          values: [
            'recebida',
            'em_analise',
            'aguardando_decisao',
            'em_preparacao',
            'enviada',
            'encerrada',
            'nao_entrar',
            'analisar_mais',
            'falha_analise',
          ],
          maxSelect: 1,
        })
      } else {
        newFields.push(f)
      }
    }
    col.fields = newFields
    app.save(col)

    var configCol = app.findCollectionByNameOrId('config')

    var perfilEmpresa =
      'EMPRESA: HEBRON ASSESSORIA E CONSULTORIA LTDA\n' +
      'CNPJ: 50.535.752/0001-25\n' +
      'PORTE: EPP (Empresa de Pequeno Porte) — direito a tratamento diferenciado LC 123/2006\n' +
      'SEDE: R Santa Cruz 65, Centro, Lages/SC, CEP 88.501-030\n' +
      'DATA DE ABERTURA: 03/05/2023 (empresa com ~3 anos)\n' +
      'NATUREZA JURÍDICA: 206-2 Sociedade Empresária Limitada\n\n' +
      'CNAE PRINCIPAL:\n8599-6/04 Treinamento em desenvolvimento profissional e gerencial\n\n' +
      'CNAEs SECUNDÁRIOS:\n' +
      '4322-3/01 Instalações hidráulicas, sanitárias e de gás\n' +
      '4322-3/02 Instalação/manutenção de ar condicionado, ventilação e refrigeração\n' +
      '4329-1/04 Montagem/instalação de iluminação e sinalização em vias públicas, portos, aeroportos\n' +
      '6209-1/00 Suporte técnico, manutenção e outros serviços de TI\n' +
      '7020-4/00 Consultoria em gestão empresarial\n' +
      '7112-0/00 Serviços de engenharia\n' +
      '8121-4/00 Limpeza em prédios e domicílios\n' +
      '8211-3/00 Serviços combinados de escritório e apoio administrativo\n' +
      '9511-8/00 Reparação e manutenção de computadores e periféricos'

    var promptCamada1 =
      'Você é um analista sênior de licitações públicas brasileiras. Analise o edital e produza um parecer estruturado em JSON.\n\n' +
      'PERFIL DA EMPRESA:\n{{PERFIL_EMPRESA}}\n\n' +
      'REGRAS DE FIDELIDADE:\n' +
      '1. NUNCA invente informação. Cada dado deve existir no edital.\n' +
      '2. Se a informação não estiver no edital, use "NÃO LOCALIZADO NO EDITAL".\n' +
      '3. Indique a página/seção do edital onde encontrou cada informação (campo "fonte").\n\n' +
      'SISTEMA DE PONTUAÇÃO (0-100):\n' +
      '+20 se CNAE compatível | +15 se segmento prioritário | +10 se exclusivo ME/EPP\n' +
      '+10 se não exige atestado ou atestado simples | +10 se modalidade favorável (dispensa/cotação) | +5 se pregão eletrônico\n' +
      '+10 se opera sem estoque | +5 se valor ≤ R$ 200k | +3 se até R$ 500k\n' +
      '+5 se sem garantia ou ≤ 5% | +10 se entrega remota/Sul | +5 outras regiões\n' +
      '+5 se documentação padrão\n\n' +
      'VEREDICTO: score ≥ 70 "ENTRAR" | 45-69 "ANALISAR" | < 45 "NÃO ENTRAR"\n' +
      'TRAVAS (NÃO ENTRAR independente do score): CNAE incompatível, prazo vencido, atestado impossível, obras/combustíveis/medicamentos\n\n' +
      'SEGMENTOS PRIORITÁRIOS: Material de expediente, Higiene e limpeza, Copa e cozinha, EPIs/uniformes, Tecnologia, Mobiliário, Comunicação visual, Consultoria/Treinamentos\n\n' +
      'RETORNE APENAS JSON válido (sem markdown, sem texto adicional) com esta estrutura:\n' +
      '{\n' +
      '  "veredicto": "ENTRAR|ANALISAR|NÃO ENTRAR",\n' +
      '  "score": number,\n' +
      '  "trava": string|null,\n' +
      '  "resumo_simples": "string",\n' +
      '  "titulo": "título extraído do edital",\n' +
      '  "numero_edital": "número do edital",\n' +
      '  "orgao": "órgão responsável",\n' +
      '  "municipio_uf": "município/UF",\n' +
      '  "modalidade": "modalidade da licitação",\n' +
      '  "data_abertura": "data de abertura no formato YYYY-MM-DD",\n' +
      '  "identificacao": {},\n' +
      '  "objeto": {"valor":"string","fonte":"string"},\n' +
      '  "itens": [],\n' +
      '  "total_itens": "string",\n' +
      '  "valores_prazos": {},\n' +
      '  "compatibilidade": {"cnae_compativel":boolean,"cnae_match":"string","justificativa":"string"},\n' +
      '  "fit_estrategico": {"segmento_prioritario":boolean,"segmento":"string","opera_sem_estoque":"string","recorrencia":"string"},\n' +
      '  "beneficio_epp": {"valor":"string","fonte":"string"},\n' +
      '  "local_entrega": {"valor":"string","fonte":"string"},\n' +
      '  "pontos_positivos": [],\n' +
      '  "riscos": [],\n' +
      '  "glossario": [{"termo":"string","explicacao":"string"}],\n' +
      '  "recomendacao": "string"\n' +
      '}'

    var configs = [
      { chave: 'perfil_empresa', valor: perfilEmpresa },
      { chave: 'prompt_camada1', valor: promptCamada1 },
    ]

    for (var i = 0; i < configs.length; i++) {
      var c = configs[i]
      try {
        var existing = app.findFirstRecordByData('config', 'chave', c.chave)
        existing.set('valor', c.valor)
        app.save(existing)
      } catch (_) {
        var record = new Record(configCol)
        record.set('chave', c.chave)
        record.set('valor', c.valor)
        app.save(record)
      }
    }
  },
  (app) => {
    var col = app.findCollectionByNameOrId('oportunidades')
    var newFields = []
    for (var i = 0; i < col.fields.length; i++) {
      var f = col.fields[i]
      if (f.name === 'status') {
        newFields.push({
          name: 'status',
          type: 'select',
          values: [
            'recebida',
            'em_analise',
            'aguardando_decisao',
            'em_preparacao',
            'enviada',
            'encerrada',
            'nao_entrar',
            'analisar_mais',
          ],
          maxSelect: 1,
        })
      } else {
        newFields.push(f)
      }
    }
    col.fields = newFields
    app.save(col)
  },
)
