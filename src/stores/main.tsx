import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Opportunity, UserRole, OpportunityStatus } from '@/lib/types'
import pb from '@/lib/pocketbase/client'
import { useAuthStore } from '@/stores/auth'
import type { RecordModel } from 'pocketbase'

interface MainStoreValue {
  opportunities: Opportunity[]
  role: UserRole
  setRole: (role: UserRole) => void
  addOpportunity: (opp: Opportunity, files?: File[]) => Promise<void>
  updateOpportunity: (id: string, data: Partial<Opportunity>) => Promise<void>
  deleteOpportunity: (id: string) => Promise<void>
  deleteAllOpportunities: () => Promise<void>
  refreshOpportunities: () => Promise<void>
  uploadFiles: (id: string, files: File[]) => Promise<void>
  deleteFile: (id: string, filename: string) => Promise<void>
  isLoading: boolean
}

const MainContext = createContext<MainStoreValue | null>(null)

function parseJsonField(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return undefined
    }
  }
  return value
}

function mapRecordToOpportunity(record: RecordModel): Opportunity {
  const municipioUf = (record as any).municipio_uf || ''
  const [city, state] = municipioUf.split('/').map((s: string) => s.trim())
  return {
    id: record.id,
    title: (record as any).titulo || '',
    number: (record as any).numero_edital || '',
    organ: (record as any).orgao || '',
    modality: (record as any).modalidade || '',
    status: ((record as any).status as OpportunityStatus) || 'recebida',
    verdict: (record as any).verdict || 'Pendente',
    score: (record as any).score || 0,
    dateAdded: (record as any).created || new Date().toISOString(),
    dueDate: (record as any).data_abertura || '',
    openingDate: (record as any).data_abertura || '',
    state: state || '',
    city: city || '',
    portal: (record as any).portal || '',
    responsible: (record as any).responsavel || '',
    observations: (record as any).observations || '',
    resultado: (record as any).resultado || null,
    valorHomologado: (record as any).valor_homologado || '',
    aprendizado: (record as any).aprendizado || '',
    radarSynced: (record as any).radar_synced || false,
    analysis: parseJsonField((record as any).analysis) as Opportunity['analysis'],
    deepRisco: parseJsonField((record as any).deep_risco) as Opportunity['deepRisco'],
    deepMargem: parseJsonField((record as any).deep_margem) as Opportunity['deepMargem'],
    decisionGate: parseJsonField((record as any).decision_gate) as Opportunity['decisionGate'],
    checklist: parseJsonField((record as any).checklist) as Opportunity['checklist'],
    estimatedMargin: (record as any).estimated_margin,
    motorScore: parseJsonField((record as any).motor_score) as Opportunity['motorScore'],
    motorDecision: (record as any).motor_decision,
    motorMemo: (record as any).motor_memo,
    files: (record as any).files || [],
    responsavelId: (record as any).responsavel_id,
    createdBy: (record as any).created_by,
  }
}

export function MainProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [role, setRole] = useState<UserRole>('admin')
  const [isLoading, setIsLoading] = useState(false)

  const refreshOpportunities = useCallback(async () => {
    if (!user) {
      setOpportunities([])
      return
    }
    setIsLoading(true)
    try {
      const records = await pb.collection('oportunidades').getFullList({ sort: '-created' })
      setOpportunities(records.map(mapRecordToOpportunity))
    } catch {
      setOpportunities([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const addOpportunity = async (opp: Opportunity, files?: File[]) => {
    const formData = new FormData()
    formData.append('titulo', opp.title)
    formData.append('numero_edital', opp.number)
    formData.append('orgao', opp.organ)
    formData.append('municipio_uf', `${opp.city}/${opp.state}`.replace(/^\//, ''))
    formData.append('modalidade', opp.modality)
    formData.append('portal', opp.portal)
    formData.append('data_abertura', opp.openingDate)
    formData.append('responsavel', opp.responsible)
    formData.append('status', opp.status)
    formData.append('verdict', opp.verdict)
    formData.append('score', String(opp.score))
    formData.append('observations', opp.observations)
    formData.append('radar_synced', String(opp.radarSynced))
    if (user?.id) formData.append('created_by', user.id)
    if (opp.checklist) formData.append('checklist', JSON.stringify(opp.checklist))
    if (files) files.forEach((f) => formData.append('files', f))
    const record = await pb.collection('oportunidades').create(formData)
    setOpportunities((prev) => [mapRecordToOpportunity(record), ...prev])
  }

  const updateOpportunity = async (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
    const updateData: Record<string, unknown> = {}
    const fieldMap: Record<string, string> = {
      title: 'titulo',
      number: 'numero_edital',
      organ: 'orgao',
      modality: 'modalidade',
      portal: 'portal',
      openingDate: 'data_abertura',
      responsible: 'responsavel',
      status: 'status',
      verdict: 'verdict',
      score: 'score',
      observations: 'observations',
      resultado: 'resultado',
      valorHomologado: 'valor_homologado',
      aprendizado: 'aprendizado',
      radarSynced: 'radar_synced',
      motorDecision: 'motor_decision',
      motorMemo: 'motor_memo',
    }
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || key === 'id' || key === 'dateAdded' || key === 'files') continue
      const pbKey = fieldMap[key]
      if (pbKey) {
        updateData[pbKey] =
          typeof value === 'object' && value !== null ? JSON.stringify(value) : value
      } else if (key === 'city' || key === 'state') {
        const opp = opportunities.find((o) => o.id === id)
        if (opp)
          updateData['municipio_uf'] =
            `${data.city || opp.city}/${data.state || opp.state}`.replace(/^\//, '')
      } else if (key === 'analysis') {
        updateData['analysis'] = JSON.stringify(value)
      } else if (key === 'deepRisco') {
        updateData['deep_risco'] = JSON.stringify(value)
      } else if (key === 'deepMargem') {
        updateData['deep_margem'] = JSON.stringify(value)
      } else if (key === 'decisionGate') {
        updateData['decision_gate'] = JSON.stringify(value)
      } else if (key === 'checklist') {
        updateData['checklist'] = JSON.stringify(value)
      } else if (key === 'motorScore') {
        updateData['motor_score'] = JSON.stringify(value)
      } else if (key === 'estimatedMargin') {
        updateData['estimated_margin'] = value
      }
    }
    try {
      await pb.collection('oportunidades').update(id, updateData)
    } catch (e) {
      console.error('Failed to update:', e)
    }
  }

  const deleteOpportunity = async (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    try {
      await pb.collection('oportunidades').delete(id)
    } catch (e) {
      console.error(e)
    }
  }

  const deleteAllOpportunities = async () => {
    const current = [...opportunities]
    setOpportunities([])
    for (const opp of current) {
      try {
        await pb.collection('oportunidades').delete(opp.id)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const uploadFiles = async (id: string, files: File[]) => {
    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    const record = await pb.collection('oportunidades').update(id, formData)
    setOpportunities((prev) => prev.map((o) => (o.id === id ? mapRecordToOpportunity(record) : o)))
  }

  const deleteFile = async (id: string, filename: string) => {
    const formData = new FormData()
    formData.append('files-', filename)
    const record = await pb.collection('oportunidades').update(id, formData)
    setOpportunities((prev) => prev.map((o) => (o.id === id ? mapRecordToOpportunity(record) : o)))
  }

  return (
    <MainContext.Provider
      value={{
        opportunities,
        role,
        setRole,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        deleteAllOpportunities,
        refreshOpportunities,
        uploadFiles,
        deleteFile,
        isLoading,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default function useMainStore() {
  const ctx = useContext(MainContext)
  if (!ctx) throw new Error('useMainStore must be used within MainProvider')
  return ctx
}
