export type OpportunityStatus =
  | 'Recebida'
  | 'Em Análise'
  | 'Documentação Incompleta'
  | 'Analisar Mais'
  | 'Entrar'
  | 'Não Entrar'
  | 'Em Preparação'
  | 'Enviada'

export type Verdict = 'Entrar' | 'Analisar Mais' | 'Não Entrar' | 'Pendente'

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
  state: string
}
