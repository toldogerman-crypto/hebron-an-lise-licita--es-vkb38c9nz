onRecordAfterUpdateSuccess((e) => {
  const record = e.record
  const oldStatus = record.original().getString('status')
  const newStatus = record.getString('status')

  if (oldStatus === newStatus) return e.next()
  if (newStatus !== 'encerrada') return e.next()

  let planilhaUrl = ''
  try {
    const configRecord = $app.findFirstRecordByData('config', 'chave', 'planilha_radar_url')
    planilhaUrl = configRecord.getString('valor')
  } catch (_) {}

  if (!planilhaUrl) return e.next()

  try {
    const rowData = JSON.stringify({
      numero: record.getString('numero_edital'),
      orgao: record.getString('orgao'),
      status: newStatus,
      resultado: record.getString('resultado'),
      valor_homologado: record.getString('valor_homologado'),
      responsavel: record.getString('responsavel'),
    })

    const res = $http.send({
      url: planilhaUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rowData,
      timeout: 15,
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      record.set('radar_synced', true)
      $app.save(record)
    } else {
      $app
        .logger()
        .error('Sheets sync failed on finalize', 'oppId', record.id, 'status', res.statusCode)
    }
  } catch (err) {
    $app.logger().error('Sheets sync error on finalize', 'oppId', record.id, 'error', err.message)
  }

  return e.next()
}, 'oportunidades')
