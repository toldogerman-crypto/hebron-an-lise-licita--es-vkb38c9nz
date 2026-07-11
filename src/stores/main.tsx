import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { Opportunity, UserRole, OpportunityStatus } from '@/lib/types'
import { skipCloud, SKIP_CLOUD_ENABLED } from '@/lib/skip-cloud'
import useAuthStore from '@/stores/auth'

const STORAGE_KEY = 'hebron-pipeline-v3'

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

function mapRecordToOpportunity(record: Record<string, unknown>): Opportunity {
  return {
    id: record.id as string,
    title: (record.title as string) || '',
    number: (record.number as string) || '',
    organ: (record.organ as string) || '',
    modality: (record.modality as string) || '',
    status: (record.status as OpportunityStatus) || 'recebida',
    verdict: (record.verdict as Opportunity['verdict']) || 'Pendente',
    score: (record.score as number) || 0,
    dateAdded: (record.created as string) || new Date().toISOString(),
    dueDate: (record.dueDate as string) || '',
    openingDate: (record.openingDate as string) || '',
    state: (record.state as string) || '',
    city: (record.city as string) || '',
    portal: (record.portal as string) || '',
    responsible: (record.responsible as string) || '',
    observations: (record.observations as string) || '',
    resultado: (record.resultado as Opportunity['resultado']) || null,
    valorHomologado: (record.valorHomologado as string) || '',
    aprendizado: (record.aprendizado as string) || '',
    analysis: parseJsonField(record.analysis) as Opportunity['analysis'],
    deepRisco: parseJsonField(record.deepRisco) as Opportunity['deepRisco'],
    deepMargem: parseJsonField(record.deepMargem) as Opportunity['deepMargem'],
    decisionGate: parseJsonField(record.decisionGate) as Opportunity['decisionGate'],
    radarSynced: (record.radarSynced as boolean) || false,
    estimatedMargin: record.estimatedMargin as number | undefined,
    checklist: parseJsonField(record.checklist) as Opportunity['checklist'],
    files: (record.files as string[]) || [],
  }
}

export function MainProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [role, setRole] = useState<UserRole>('admin')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const roleData = localStorage.getItem('hebron-role-v1')
    if (roleData) setRole(roleData as UserRole)
  }, [])

  useEffect(() => {
    localStorage.setItem('hebron-role-v1', role)
  }, [role])

  const refreshOpportunities = useCallback(async () => {
    if (!user) {
      setOpportunities([])
      setIsLoaded(true)
      return
    }
    setIsLoading(true)
    try {
      if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
        const data = await skipCloud.list('opportunities', { sort: '-created', perPage: '200' })
        setOpportunities((data.items as Record<string, unknown>[]).map(mapRecordToOpportunity))
      } else {
        const data = localStorage.getItem(STORAGE_KEY)
        setOpportunities(data ? JSON.parse(data) : [])
      }
    } catch {
      const data = localStorage.getItem(STORAGE_KEY)
      setOpportunities(data ? JSON.parse(data) : [])
    } finally {
      setIsLoading(false)
      setIsLoaded(true)
    }
  }, [user])

  useEffect(() => {
    refreshOpportunities()
  }, [refreshOpportunities])

  useEffect(() => {
    if (isLoaded && !SKIP_CLOUD_ENABLED) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities))
    }
  }, [opportunities, isLoaded])

  const addOpportunity = async (opp: Opportunity, files?: File[]) => {
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      const formData = new FormData()
      formData.append('title', opp.title)
      formData.append('number', opp.number)
      formData.append('organ', opp.organ)
      formData.append('modality', opp.modality)
      formData.append('status', opp.status)
      formData.append('verdict', opp.verdict)
      formData.append('score', String(opp.score))
      formData.append('dueDate', opp.dueDate)
      formData.append('openingDate', opp.openingDate)
      formData.append('state', opp.state)
      formData.append('city', opp.city)
      formData.append('portal', opp.portal)
      formData.append('responsible', opp.responsible)
      formData.append('observations', opp.observations)
      formData.append('radarSynced', String(opp.radarSynced))
      if (opp.checklist) formData.append('checklist', JSON.stringify(opp.checklist))
      if (files) files.forEach((f) => formData.append('files', f))
      const record = await skipCloud.create('opportunities', formData)
      setOpportunities((prev) => [mapRecordToOpportunity(record), ...prev])
    } else {
      setOpportunities((prev) => [{ ...opp, files: files?.map((f) => f.name) || [] }, ...prev])
    }
  }

  const updateOpportunity = async (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      try {
        const updateData: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && key !== 'id' && key !== 'dateAdded' && key !== 'files') {
            updateData[key] =
              typeof value === 'object' && value !== null ? JSON.stringify(value) : value
          }
        }
        await skipCloud.update('opportunities', id, updateData)
      } catch (e) {
        console.error('Failed to update opportunity:', e)
      }
    }
  }

  const deleteOpportunity = async (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      try {
        await skipCloud.delete('opportunities', id)
      } catch (e) {
        console.error('Failed to delete:', e)
      }
    }
  }

  const deleteAllOpportunities = async () => {
    const current = [...opportunities]
    setOpportunities([])
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      try {
        for (const opp of current) {
          await skipCloud.delete('opportunities', opp.id)
        }
      } catch (e) {
        console.error('Failed to delete all:', e)
      }
    }
  }

  const uploadFiles = async (id: string, files: File[]) => {
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      const formData = new FormData()
      files.forEach((f) => formData.append('files', f))
      const record = await skipCloud.update('opportunities', id, formData)
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? mapRecordToOpportunity(record) : o)),
      )
    } else {
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, files: [...(o.files || []), ...files.map((f) => f.name)] } : o,
        ),
      )
    }
  }

  const deleteFile = async (id: string, filename: string) => {
    if (SKIP_CLOUD_ENABLED && skipCloud.getToken()) {
      const formData = new FormData()
      formData.append('files.__delete', filename)
      const record = await skipCloud.update('opportunities', id, formData)
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? mapRecordToOpportunity(record) : o)),
      )
    } else {
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, files: (o.files || []).filter((f) => f !== filename) } : o,
        ),
      )
    }
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
      {isLoaded ? children : null}
    </MainContext.Provider>
  )
}

function useMainStore() {
  const ctx = useContext(MainContext)
  if (!ctx) throw new Error('useMainStore must be used within MainProvider')
  return ctx
}

export default useMainStore
