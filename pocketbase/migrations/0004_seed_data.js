migrate(
  (app) => {
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'toldogerman@gmail.com')
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const record = new Record(users)
      record.setEmail('toldogerman@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin Hebron')
      app.save(record)
    }

    const configCol = app.findCollectionByNameOrId('config')
    var configs = [
      { chave: 'planilha_radar_url', valor: '' },
      {
        chave: 'perfil_empresa',
        valor: 'HEBRON ASSESSORIA E CONSULTORIA LTDA - CNPJ: 50.535.752/0001-25 - EPP',
      },
      {
        chave: 'pesos_motor',
        valor: JSON.stringify({ elegibilidade: 25, prazo: 20, financeiro: 30, execucao: 25 }),
      },
      {
        chave: 'knockouts_motor',
        valor: JSON.stringify([
          'cnae_incompativel',
          'prazo_vencido',
          'atestado_impossivel',
          'obra_publica',
        ]),
      },
      { chave: 'margem_minima', valor: '15' },
      { chave: 'prazo_minimo_dias', valor: '3' },
    ]

    for (var i = 0; i < configs.length; i++) {
      var c = configs[i]
      try {
        app.findFirstRecordByData('config', 'chave', c.chave)
      } catch (_) {
        var record = new Record(configCol)
        record.set('chave', c.chave)
        record.set('valor', c.valor)
        app.save(record)
      }
    }

    try {
      app.findFirstRecordByData('oportunidades', 'numero_edital', 'PE 045/2026')
    } catch (_) {
      var oppCol = app.findCollectionByNameOrId('oportunidades')
      var opp = new Record(oppCol)
      opp.set('titulo', 'Servicos de Consultoria em TI e Mapeamento de Processos')
      opp.set('numero_edital', 'PE 045/2026')
      opp.set('orgao', 'Ministerio do Meio Ambiente')
      opp.set('municipio_uf', 'Brasilia/DF')
      opp.set('modalidade', 'Pregao Eletronico')
      opp.set('portal', 'Portal de Compras do Governo Federal')
      opp.set('data_abertura', '2026-08-20 09:00')
      opp.set('responsavel', 'Carlos Eduardo')
      opp.set('status', 'em_analise')
      opp.set('score', 85)
      opp.set('verdict', 'ENTRAR')
      opp.set('radar_synced', false)
      opp.set('observations', 'Oportunidade estrategica alinhada ao portfólio da Hebron.')
      app.save(opp)
    }
  },
  (app) => {},
)
