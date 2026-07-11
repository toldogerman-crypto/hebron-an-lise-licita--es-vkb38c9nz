import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Opportunity } from '@/lib/types'
import { mockOpportunities } from '@/lib/mock-data'

const STORAGE_KEY = 'hebron-pipeline-v1'

interface MainStoreValue {
  opportunities: Opportunity[]
  addOpportunity: (opp: Opportunity) => void
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void
  deleteAllOpportunities: () => void
}

const MainContext = createContext<MainStoreValue | null>(null)

export function MainProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setOpportunities(JSON.parse(data))
      } else {
        setOpportunities(mockOpportunities)
      }
    } catch (e) {
      setOpportunities(mockOpportunities)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities))
    }
  }, [opportunities, isLoaded])

  const addOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => [opp, ...prev])
  }

  const updateOpportunity = (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
  }

  const deleteAllOpportunities = () => {
    setOpportunities([])
  }

  return (
    <MainContext.Provider
      value={{ opportunities, addOpportunity, updateOpportunity, deleteAllOpportunities }}
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
