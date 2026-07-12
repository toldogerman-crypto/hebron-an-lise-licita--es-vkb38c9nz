export type OpportunityStatus =
  | 'recebida'
  | 'em_analise'
  | 'aguardando_decisao'
  | 'em_preparacao'
  | 'enviada'
  | 'encerrada'
  | 'nao_entrar'
  | 'analisar_mais'

export type Verdict = 'ENTRAR' | 'ANALISAR MAIS' | 'NÃO ENTRAR' | 'Pendente'
export type UrgencyLevel = 'green' | 'yellow' | 'red'
export type ResultStatus = 'ganhou' | 'perdeu' | 'nao_participou'
export type UserRole = 'admin' | 'legal' | 'financial'
export type MotorDecision = 'GO' | 'GO_CONDICIONAL' | 'NO_GO'
export type GateDecision = 'ENTRAR' | 'ANALISAR_MAIS' | 'NAO_ENTRAR'
export type ChecklistStatus = 'pendente' | 'em_preparacao' | 'pronto' | 'nao_aplicavel'

export interface AnalysisResult {
  veredicto: Verdict
  score: number
  trava: string | null
  resumo_simples: string
  identificacao: Record<string, { valor: string; fonte: string } | undefined>
  objeto: { valor: string; fonte: string }
  itens: Array<{
    item: string
    quantidade: string
    unidade: string
    valor_unitario_estimado: string
    fonte: string
  }>
  total_itens: string
  valores_prazos: Record<string, { valor: string; fonte: string } | undefined>
  compatibilidade: { cnae_compativel: boolean; cnae_match: string; justificativa: string }
  fit_estrategico: {
    segmento_prioritario: boolean
    segmento: string
    opera_sem_estoque: string
    recorrencia: string
  }
  beneficio_epp: { valor: string; fonte: string }
  exigencias: Record<string, unknown>
  local_entrega: { valor: string; fonte: string }
  pontos_positivos: string[]
  riscos: string[]
  glossario: Array<{ termo: string; explicacao: string }>
  recomendacao: string
}

export interface DeepAnalysisRisco {
  classificacao: 'A' | 'B' | 'C'
  justificativa_classe: string
  risco_financeiro: { nota: number; fatores: Array<{ fator: string; fonte: string }> }
  risco_documental: { nota: number; fatores: Array<{ fator: string; fonte: string }> }
  risco_operacional: { nota: number; fatores: Array<{ fator: string; fonte: string }> }
  multas_penalidades: { valor: string; fonte: string }
  capital_giro_estimado: string
}

export interface DeepAnalysisMargem {
  margem: {
    custo_mercado_estimado: string
    fontes_pesquisa: string[]
    margem_bruta_estimada: string
    avaliacao: string
    alerta: string
  }
  plano: {
    chance_exito: string
    documentos_checklist: string[]
    cronograma: Array<{ prazo: string; acao: string }>
    acoes_chave: string[]
    primeiro_passo: string
  }
}

export interface DecisionQuestion {
  id: number
  question: string
  answer: boolean | null
  autoFilled: boolean
  hint: string
}

export interface ChecklistItem {
  id: string
  task: string
  completed: boolean
}

export interface MotorScore {
  elegibilidade: number
  prazo: number
  financeiro: number
  execucao: number
  total: number
}

export interface KnockoutCheck {
  id: string
  label: string
  triggered: boolean
  source: string
}

export interface Opportunity {
  id: string
  title: string
  number: string
  organ: string
  modality: string
  status: OpportunityStatus
  verdict: Verdict
  score: number
  dateAdded: string
  dueDate: string
  openingDate: string
  state: string
  city: string
  portal: string
  responsible: string
  observations: string
  resultado?: ResultStatus | null
  valorHomologado?: string
  aprendizado?: string
  analysis?: AnalysisResult
  deepRisco?: DeepAnalysisRisco
  deepMargem?: DeepAnalysisMargem
  decisionGate?: DecisionQuestion[]
  radarSynced: boolean
  estimatedMargin?: number
  checklist?: ChecklistItem[]
  files?: string[]
  motorScore?: MotorScore
  motorDecision?: MotorDecision
  motorMemo?: string
  knockouts?: KnockoutCheck[]
  createdBy?: string
  responsavelId?: string
}
