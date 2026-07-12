onRecordAfterCreateSuccess((e) => {
  const record = e.record
  const oppId = record.getString('oportunidade_id')

  let planilhaUrl = ''
  try {
    const configRecord = $app.findFirstRecordByData('config', 'chave', 'planilha_radar_url')
    planilhaUrl = configRecord.getString('valor')
  } catch (_) {}

  if (!planilhaUrl) return e.next()

  try {
    let opp
    try {
      opp = $app.findRecordById('oportunidades', oppId)
    } catch (_) {
      return e.next()
    }

    const rowData = JSON.stringify({
      numero: opp.getString('numero_edital'),
      orgao: opp.getString('orgao'),
      status: opp.getString('status'),
      score: opp.getString('score'),
      decisao: record.getString('decisao'),
      responsavel: opp.getString('responsavel'),
    })

    const res = $http.send({
      url: planilhaUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rowData,
      timeout: 15,
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      opp.set('radar_synced', true)
      $app.save(opp)
    } else {
      $app.logger().error('Google Sheets sync failed', 'oppId', oppId, 'status', res.statusCode)
    }
  } catch (err) {
    $app.logger().error('Sheets sync error', 'oppId', oppId, 'error', err.message)
  }

  return e.next()
}, 'gate_decisoes')
