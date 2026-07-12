import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { listOportunidades, deleteOportunidade } from '@/services/oportunidades'
import type { Opportunity, UserRole } from '@/lib/types'

interface MainStoreContextType {
  opportunities: Opportunity[]
  role: UserRole
  setRole: (role: UserRole) => void
  refreshOpportunities: () => Promise<void>
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => Promise<void>
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

export const useMainStore = () => {
  const ctx = useContext(MainStoreContext)
  if (!ctx) throw new Error('useMainStore must be used within MainProvider')
  return ctx
}

function parseJsonField<T>(value: unknown): T | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return undefined
    }
  }
  return value as T
}

export function mapRecordToOpportunity(record: Record<string, any>): Opportunity {
  const municipioUf = record.municipio_uf || ''
  const parts = municipioUf.split('/')
  const city = parts[0]?.trim() || ''
  const state = parts[1]?.trim() || ''

  return {
    id: record.id,
    title: record.titulo || '',
    number: record.numero_edital || '',
    organ: record.orgao || '',
    modality: record.modalidade || '',
    status: record.status || 'recebida',
    verdict: record.verdict || 'Pendente',
    score: record.score || 0,
    dateAdded: record.created || '',
    dueDate: '',
    openingDate: record.data_abertura || '',
    state,
    city,
    portal: record.portal || '',
    responsible: record.responsavel || '',
    observations: record.observations || '',
    resultado: record.resultado || null,
    valorHomologado: record.valor_homologado || '',
    aprendizado: record.aprendizado || '',
    analysis: parseJsonField(record.analysis),
    deepRisco: parseJsonField(record.deep_risco),
    deepMargem: parseJsonField(record.deep_margem),
    decisionGate: parseJsonField(record.decision_gate),
    radarSynced: record.radar_synced || false,
    estimatedMargin: record.estimated_margin,
    checklist: parseJsonField(record.checklist),
    motorScore: parseJsonField(record.motor_score),
    motorDecision: record.motor_decision,
    motorMemo: record.motor_memo,
    createdBy: record.created_by,
    responsavelId: record.responsavel_id,
  }
}

export function MainProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [role, setRole] = useState<UserRole>('admin')

  const refreshOpportunities = useCallback(async () => {
    try {
      const records = await listOportunidades()
      setOpportunities(records.map(mapRecordToOpportunity))
    } catch (err) {
      console.error('Failed to refresh opportunities:', err)
    }
  }, [])

  const updateOpportunity = useCallback((id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
  }, [])

  const deleteOpportunity = useCallback(async (id: string) => {
    await deleteOportunidade(id)
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
  }, [])

  return (
    <MainStoreContext.Provider
      value={{
        opportunities,
        role,
        setRole,
        refreshOpportunities,
        updateOpportunity,
        deleteOpportunity,
      }}
    >
      {children}
    </MainStoreContext.Provider>
  )
}

export default useMainStore
