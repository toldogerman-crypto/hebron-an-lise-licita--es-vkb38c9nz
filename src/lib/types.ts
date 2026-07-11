export type OpportunityStatus =
  | 'Recebida'
  | 'Em Análise'
  | 'Documentação Incompleta'
  | 'Analisar Mais'
  | 'Entrar'
  | 'Não Entrar'
  | 'Em Preparação'
  | 'Enviada'
  | 'Análise Preliminar'

export type Verdict = 'Entrar' | 'Analisar Mais' | 'Não Entrar' | 'Pendente'
export type UrgencyLevel = 'green' | 'yellow' | 'red'

export interface ScoreItem {
  label: string
  points: number
  max: number
  source: string
}

export interface BiddingItem {
  id: string
  name: string
  quantity: number
  unit: string
  estimatedValue: number
  source: string
}

export interface ChecklistEntry {
  name: string
  category: string
  mandatory: boolean
  status: 'ok' | 'missing' | 'pending'
  source: string
}

export interface RiskEntry {
  category: string
  description: string
  severity: 'high' | 'medium' | 'low'
  source: string
}

export interface ImpugnationAlert {
  clause: string
  description: string
  deadline: string
  source: string
}

export interface DecisionQuestion {
  id: number
  question: string
  answer: boolean | null
  autoFilled: boolean
  hint: string
}

export interface AnalysisResult {
  scoreItems: ScoreItem[]
  scoreTotal: number
  items: BiddingItem[]
  risks: RiskEntry[]
  alerts: ImpugnationAlert[]
  checklist: ChecklistEntry[]
  summary: string
  technicalAnalysis: string
  recommendations: string
  estimatedMargin: number
  documentClassification: 'Completo' | 'Incompleto' | 'Análise Preliminar'
  eliminationLocks: string[]
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
  analysis?: AnalysisResult
  decisionGate?: DecisionQuestion[]
  radarSynced: boolean
  estimatedMargin?: number
}
