import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Opportunity, UserRole } from '@/lib/types'

const STORAGE_KEY = 'hebron-pipeline-v2' // bumped version to clear old mocks

interface MainStoreValue {
  opportunities: Opportunity[]
  role: UserRole
  setRole: (role: UserRole) => void
  addOpportunity: (opp: Opportunity) => void
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => void
  deleteAllOpportunities: () => void
}

const MainContext = createContext<MainStoreValue | null>(null)

export function MainProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [role, setRole] = useState<UserRole>('admin')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      const roleData = localStorage.getItem('hebron-role-v1')
      if (data) {
        setOpportunities(JSON.parse(data))
      } else {
        setOpportunities([])
      }
      if (roleData) {
        setRole(roleData as UserRole)
      }
    } catch (e) {
      setOpportunities([])
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities))
      localStorage.setItem('hebron-role-v1', role)
    }
  }, [opportunities, role, isLoaded])

  const addOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => [opp, ...prev])
  }

  const updateOpportunity = (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
  }

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
  }

  const deleteAllOpportunities = () => {
    setOpportunities([])
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
