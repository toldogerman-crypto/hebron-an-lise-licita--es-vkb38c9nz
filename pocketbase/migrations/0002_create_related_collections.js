migrate(
  (app) => {
    const oportunidadesId = app.findCollectionByNameOrId('oportunidades').id

    app.save(
      new Collection({
        name: 'documentos',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'oportunidade_id',
            type: 'relation',
            required: true,
            collectionId: oportunidadesId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'nome_arquivo', type: 'text', required: true },
          { name: 'tipo', type: 'select', values: ['edital', 'tr', 'etp', 'outro'], maxSelect: 1 },
          {
            name: 'arquivo',
            type: 'file',
            maxSelect: 1,
            maxSize: 52428800,
            mimeTypes: [
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
              'text/markdown',
              'image/png',
              'image/jpeg',
            ],
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_documentos_opp ON documentos (oportunidade_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'analises',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'oportunidade_id',
            type: 'relation',
            required: true,
            collectionId: oportunidadesId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          {
            name: 'tipo',
            type: 'select',
            values: ['camada1', 'camada23', 'camada45'],
            maxSelect: 1,
          },
          { name: 'json_resultado', type: 'json' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_analises_opp ON analises (oportunidade_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'motor_avaliacoes',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'oportunidade_id',
            type: 'relation',
            required: true,
            collectionId: oportunidadesId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'inputs', type: 'json' },
          { name: 'pesos', type: 'json' },
          { name: 'knockouts', type: 'json' },
          { name: 'score_final', type: 'number', onlyInt: true },
          {
            name: 'decisao',
            type: 'select',
            values: ['GO', 'GO_CONDICIONAL', 'NO_GO'],
            maxSelect: 1,
          },
          { name: 'memo_executivo', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_motor_opp ON motor_avaliacoes (oportunidade_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'checklist_itens',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'oportunidade_id',
            type: 'relation',
            required: true,
            collectionId: oportunidadesId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'categoria', type: 'text' },
          { name: 'documento', type: 'text' },
          { name: 'obrigatorio', type: 'bool' },
          { name: 'eliminatorio', type: 'bool' },
          {
            name: 'status',
            type: 'select',
            values: ['pendente', 'em_preparacao', 'pronto', 'nao_aplicavel'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_checklist_opp ON checklist_itens (oportunidade_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'gate_decisoes',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'oportunidade_id',
            type: 'relation',
            required: true,
            collectionId: oportunidadesId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'q1_trava', type: 'bool' },
          { name: 'q2_prazo', type: 'bool' },
          { name: 'q3_documentos', type: 'bool' },
          { name: 'q4_margem', type: 'bool' },
          { name: 'q5_capacidade', type: 'bool' },
          {
            name: 'decisao',
            type: 'select',
            values: ['ENTRAR', 'ANALISAR_MAIS', 'NAO_ENTRAR'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_gate_opp ON gate_decisoes (oportunidade_id)'],
      }),
    )
  },
  (app) => {
    ;['documentos', 'analises', 'motor_avaliacoes', 'checklist_itens', 'gate_decisoes'].forEach(
      function (name) {
        try {
          app.delete(app.findCollectionByNameOrId(name))
        } catch (_) {}
      },
    )
  },
)
