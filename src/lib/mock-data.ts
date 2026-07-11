import {
  Opportunity,
  AnalysisResult,
  DeepAnalysisRisco,
  DeepAnalysisMargem,
  DecisionQuestion,
} from './types'

export const mockAnalysisResponse: AnalysisResult = {
  veredicto: 'ENTRAR',
  score: 85,
  trava: null,
  resumo_simples:
    'O órgão visa a contratação de empresa especializada em consultoria de TI e mapeamento de processos, com foco em segurança da informação.',
  identificacao: {
    numero_edital: { valor: 'PE 045/2026', fonte: 'Pág 1' },
    orgao: { valor: 'Ministério do Meio Ambiente', fonte: 'Pág 1' },
    municipio_uf: { valor: 'Brasília/DF', fonte: 'Pág 1' },
    modalidade: { valor: 'Pregão Eletrônico', fonte: 'Pág 1' },
    srp: { valor: 'Sim', fonte: 'Pág 2' },
    portal: { valor: 'Portal de Compras do Governo Federal', fonte: 'Pág 2' },
  },
  objeto: { valor: 'Serviços de Consultoria em TI e Mapeamento de Processos', fonte: 'TR, Pág 5' },
  itens: [
    {
      item: 'Consultoria Especializada Sênior',
      quantidade: '1200',
      unidade: 'horas',
      valor_unitario_estimado: 'R$ 150,00',
      fonte: 'Anexo I, Pág 12',
    },
    {
      item: 'Relatórios de Mapeamento',
      quantidade: '50',
      unidade: 'unidades',
      valor_unitario_estimado: 'R$ 2.500,00',
      fonte: 'Anexo I, Pág 12',
    },
  ],
  total_itens: '2 itens',
  valores_prazos: {
    valor_estimado: { valor: 'R$ 305.000,00', fonte: 'TR, Pág 6' },
    data_abertura_propostas: { valor: '20/08/2026 09:00', fonte: 'Pág 1' },
    prazo_entrega_execucao: { valor: '12 meses', fonte: 'TR, Pág 10' },
    prazo_pagamento: { valor: 'Até 30 dias após ateste', fonte: 'Minuta, Cláusula 5' },
    vigencia_contrato: { valor: '12 meses, prorrogável', fonte: 'Minuta, Cláusula 4' },
  },
  compatibilidade: {
    cnae_compativel: true,
    cnae_match: '7020-4/00 Consultoria em gestão empresarial',
    justificativa: 'Objeto diretamente ligado a mapeamento e gestão de TI.',
  },
  fit_estrategico: {
    segmento_prioritario: true,
    segmento: 'Tecnologia / Consultoria',
    opera_sem_estoque: 'Sim',
    recorrencia: 'Sim',
  },
  beneficio_epp: { valor: 'Cota reservada para ME/EPP', fonte: 'Pág 3' },
  exigencias: {
    atestado_tecnico: { valor: '1 atestado de serviços similares em TI', fonte: 'Pág 18' },
    garantia: { valor: '5% do valor do contrato', fonte: 'Minuta, Cláusula 7' },
    vistoria: { valor: 'Não exigida', fonte: 'NÃO LOCALIZADO NO EDITAL' },
    amostra: { valor: 'Não exigida', fonte: 'NÃO LOCALIZADO NO EDITAL' },
    documentos_habilitacao: [
      { valor: 'SICAF regular', fonte: 'Pág 15' },
      { valor: 'Balanço Patrimonial', fonte: 'Pág 16' },
    ],
  },
  local_entrega: { valor: 'Remoto com reuniões bimestrais em Brasília', fonte: 'TR, Pág 8' },
  pontos_positivos: [
    'Entrega majoritariamente remota',
    'Cota reservada para EPP',
    'Sem exigência de vistoria ou atestados complexos',
  ],
  riscos: ['Necessidade de viagens bimestrais a Brasília pode encarecer a operação se não orçado.'],
  glossario: [
    {
      termo: 'SRP',
      explicacao: 'Sistema de Registro de Preços: o governo só contrata e paga quando precisar.',
    },
  ],
  recomendacao:
    'Edital excelente. Sugiro priorizar a montagem da planilha de custos prevendo os deslocamentos bimestrais para não achatar a margem.',
}

export const mockDeepRisco: DeepAnalysisRisco = {
  classificacao: 'A',
  justificativa_classe:
    'Oportunidade excelente com alto fit estratégico, risco baixo de inabilitação e boa rentabilidade.',
  risco_financeiro: {
    nota: 3,
    fatores: [
      {
        fator: 'Capital de giro necessário para 1 mês de operação antes do 1º ateste',
        fonte: 'Minuta, Pág 30',
      },
      { fator: 'Garantia contratual de 5% exige caução inicial', fonte: 'Minuta, Cláusula 7' },
    ],
  },
  risco_documental: {
    nota: 2,
    fatores: [
      { fator: 'Habilitação padrão SICAF', fonte: 'Edital, Pág 15' },
      { fator: 'Atestado exigido é simples e Hebron possui', fonte: 'Edital, Pág 18' },
    ],
  },
  risco_operacional: {
    nota: 4,
    fatores: [{ fator: 'Risco de atrasos nos voos para reuniões presenciais', fonte: 'TR, Pág 8' }],
  },
  multas_penalidades: {
    valor: 'Multa de 0,5% por dia de atraso na entrega de relatórios, limitada a 10%',
    fonte: 'Minuta, Cláusula 12',
  },
  capital_giro_estimado: 'Aprox. R$ 25.000,00 para cobrir a folha do 1º mês antes do recebimento.',
}

export const mockDeepMargem: DeepAnalysisMargem = {
  margem: {
    custo_mercado_estimado: 'R$ 80,00 a R$ 100,00 por hora técnica',
    fontes_pesquisa: ['Glassdoor (Analista Sênior)', 'Tabela SINAPI/Referência'],
    margem_bruta_estimada: '30% a 45%',
    avaliacao:
      'A margem estimada é muito atrativa e supera o piso exigido de 15%. O modelo de execução remoto reduz significativamente os custos fixos.',
    alerta:
      'Lembre-se de orçar passagens aéreas e hospedagem bimestrais (aprox. R$ 3.500 por viagem).',
  },
  plano: {
    chance_exito: 'Alta (75%)',
    documentos_checklist: [
      'Atualizar certidões no SICAF',
      'Separar Balanço 2025',
      'Resgatar Atestado da Prefeitura de Lages',
      'Emitir apólice de Seguro Garantia (5%)',
    ],
    cronograma: [
      { prazo: 'D-10 (10/08)', acao: 'Cotar seguro garantia' },
      { prazo: 'D-5 (15/08)', acao: 'Finalizar planilha de formação de preços' },
      { prazo: 'D-2 (18/08)', acao: 'Upload dos documentos e proposta no Portal' },
      { prazo: 'D-0 (20/08)', acao: 'Sessão Pública de lances' },
    ],
    acoes_chave: [
      'Alinhar disponibilidade com consultores parceiros',
      'Fazer cotação prévia de passagens para BSB',
    ],
    primeiro_passo:
      'Baixar atestado de capacidade técnica anterior e validar com o time jurídico se atende 100% o edital.',
  },
}

export const mockDecisionGate: DecisionQuestion[] = [
  {
    id: 1,
    question: 'Existe bloqueio eliminatório?',
    answer: false,
    autoFilled: true,
    hint: 'Verificado automaticamente pela análise de IA',
  },
  {
    id: 2,
    question: 'Há tempo suficiente para preparação?',
    answer: true,
    autoFilled: true,
    hint: 'Configurado: mínimo de 3 dias úteis',
  },
  {
    id: 3,
    question: 'Todos os documentos estão disponíveis?',
    answer: false,
    autoFilled: false,
    hint: 'Baseado no checklist documental',
  },
  {
    id: 4,
    question: 'A margem estimada supera o mínimo (15%)?',
    answer: true,
    autoFilled: false,
    hint: 'Margem estimada deve ser revisada',
  },
  {
    id: 5,
    question: 'Temos capacidade operacional?',
    answer: null,
    autoFilled: false,
    hint: 'Avaliação do gestor',
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: mockAnalysisResponse.objeto.valor,
    number: mockAnalysisResponse.identificacao.numero_edital?.valor || '045/2026',
    organ: mockAnalysisResponse.identificacao.orgao?.valor || 'Ministério do Meio Ambiente',
    modality: mockAnalysisResponse.identificacao.modalidade?.valor || 'Pregão Eletrônico',
    status: 'interesse',
    verdict: mockAnalysisResponse.veredicto,
    score: mockAnalysisResponse.score,
    dateAdded: '2026-07-10T10:00:00Z',
    dueDate: '2026-08-20T09:00:00Z',
    openingDate: '2026-08-20T09:00:00Z',
    state: 'DF',
    city: 'Brasília',
    portal: mockAnalysisResponse.identificacao.portal?.valor || 'ComprasNet',
    responsible: 'Carlos Eduardo',
    observations: mockAnalysisResponse.resumo_simples,
    radarSynced: false,
    analysis: mockAnalysisResponse,
    deepRisco: mockDeepRisco,
    deepMargem: mockDeepMargem,
    decisionGate: mockDecisionGate,
  },
  {
    id: 'opp-2',
    title: 'Estudo de Viabilidade para Porto Seco',
    number: '045/2026',
    organ: 'Governo do Estado',
    modality: 'Concorrência',
    status: 'aguardando',
    verdict: 'ENTRAR',
    score: 92,
    dateAdded: '2026-07-08T14:30:00Z',
    dueDate: '2026-08-01T10:00:00Z',
    openingDate: '2026-08-01T10:00:00Z',
    state: 'SP',
    city: 'São Paulo',
    portal: 'BEC SP',
    responsible: 'Carlos Eduardo',
    observations: 'Oportunidade estratégica alinhada ao portfólio da Hebron.',
    radarSynced: true,
  },
  {
    id: 'opp-3',
    title: 'Auditoria de Processos Licitatórios',
    number: '012/2026',
    organ: 'Prefeitura Municipal',
    modality: 'Tomada de Preços',
    status: 'sessao',
    verdict: 'ANALISAR MAIS',
    score: 65,
    dateAdded: '2026-07-09T09:15:00Z',
    dueDate: new Date().toISOString(),
    openingDate: new Date().toISOString(),
    state: 'MG',
    city: 'Belo Horizonte',
    portal: 'Portal de Compras',
    responsible: 'Ana Paula',
    observations: 'Verificar requisitos de equipe técnica mínima.',
    radarSynced: true,
  },
  {
    id: 'opp-4',
    title: 'Plano Diretor de Tecnologia da Informação',
    number: '089/2026',
    organ: 'Tribunal de Justiça',
    modality: 'Pregão Eletrônico',
    status: 'finalizado',
    verdict: 'NÃO ENTRAR',
    resultado: 'ganhou',
    valorHomologado: '150.000,00',
    aprendizado: 'Fomos agressivos no preço e ganhamos na etapa de lances abertos.',
    score: 30,
    dateAdded: '2026-07-05T11:45:00Z',
    dueDate: '2026-07-13T08:30:00Z',
    openingDate: '2026-07-13T08:30:00Z',
    state: 'RJ',
    city: 'Rio de Janeiro',
    portal: 'Licitações-e',
    responsible: 'Carlos Eduardo',
    observations: 'CNAE incompatível e segmento excluído.',
    radarSynced: true,
  },
]
