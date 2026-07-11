import { createContext, useContext, useState, ReactNode } from 'react'
import { Opportunity, AnalysisResult, DecisionQuestion } from '@/lib/types'
import { mockOpportunities } from '@/lib/mock-data'
import { analysisById, decisionGateById } from '@/lib/mock-analysis'

interface MainStoreValue {
  opportunities: Opportunity[]
  analysis: Record<string, AnalysisResult>
  decisionGates: Record<string, DecisionQuestion[]>
  deleteAllOpportunities: () => void
}

const MainContext = createContext<MainStoreValue | null>(null)

export function MainProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities)
  const [analysis, setAnalysis] = useState<Record<string, AnalysisResult>>(analysisById)
  const [decisionGates, setDecisionGates] =
    useState<Record<string, DecisionQuestion[]>>(decisionGateById)

  const deleteAllOpportunities = () => {
    setOpportunities([])
    setAnalysis({})
    setDecisionGates({})
  }

  return (
    <MainContext.Provider
      value={{ opportunities, analysis, decisionGates, deleteAllOpportunities }}
    >
      {children}
    </MainContext.Provider>
  )
}

function useMainStore() {
  const ctx = useContext(MainContext)
  if (!ctx) throw new Error('useMainStore must be used within MainProvider')
  return ctx
}

export default useMainStore
