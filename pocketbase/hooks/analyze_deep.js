routerAdd(
  'POST',
  '/backend/v1/analyze/deep',
  (e) => {
    const body = e.requestInfo().body || {}
    const oportunidadeId = body.oportunidade_id
    const tipo = body.tipo || 'camada23'
    if (!oportunidadeId) return e.badRequestError('oportunidade_id é obrigatório')

    let opp
    try {
      opp = $app.findRecordById('oportunidades', oportunidadeId)
    } catch (_) {
      return e.notFoundError('oportunidade não encontrada')
    }

    let promptKey = tipo === 'camada45' ? 'prompt_camada45' : 'prompt_camada23'
    let promptText = ''
    try {
      const configRecord = $app.findFirstRecordByData('config', 'chave', promptKey)
      promptText = configRecord.getString('valor')
    } catch (_) {}
    if (!promptText) {
      promptText =
        tipo === 'camada45'
          ? 'Você é um analista comercial de licitações. Estime margem e crie plano de participação. Retorne JSON com margem e plano.'
          : 'Você é um analista de risco de licitações. Classifique A/B/C e analise riscos financeiro, documental e operacional. Retorne JSON.'
    }

    const analysisData = opp.getString('analysis') || ''
    const oppInfo =
      'Título: ' +
      opp.getString('titulo') +
      '\nÓrgão: ' +
      opp.getString('orgao') +
      '\nScore: ' +
      opp.getString('score')

    try {
      const reply = $ai.chat({
        model: 'reasoning',
        messages: [
          { role: 'system', content: promptText },
          {
            role: 'user',
            content:
              'Oportunidade:\n' + oppInfo + '\n\nAnálise Camada 1:\n' + (analysisData || 'N/A'),
          },
        ],
      })

      const content = reply.choices[0].message.content

      const analisesCol = $app.findCollectionByNameOrId('analises')
      const analiseRecord = new Record(analisesCol)
      analiseRecord.set('oportunidade_id', oportunidadeId)
      analiseRecord.set('tipo', tipo)
      analiseRecord.set('json_resultado', content)
      $app.save(analiseRecord)

      try {
        const parsed = JSON.parse(content)
        if (tipo === 'camada23') {
          opp.set('deep_risco', JSON.stringify(parsed))
        } else {
          opp.set('deep_margem', JSON.stringify(parsed))
        }
        $app.save(opp)
      } catch (_) {}

      return e.json(200, { success: true, content: content, tipo: tipo })
    } catch (err) {
      if (err instanceof SkipAiConfigError)
        return e.json(503, { error: 'IA temporariamente indisponível' })
      if (err instanceof SkipAiError) return e.json(502, { error: 'Falha na chamada de IA' })
      throw err
    }
  },
  $apis.requireAuth(),
)
