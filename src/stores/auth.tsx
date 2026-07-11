import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { skipCloud, SKIP_CLOUD_ENABLED } from '@/lib/skip-cloud'

interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthStoreValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthStoreValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = skipCloud.getToken()
    const userData = localStorage.getItem('sc-user')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('sc-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    if (SKIP_CLOUD_ENABLED) {
      const data = await skipCloud.login(email, password)
      const authUser: AuthUser = {
        id: data.record.id,
        email: data.record.email,
        name: data.record.name || data.record.email,
      }
      setUser(authUser)
      localStorage.setItem('sc-user', JSON.stringify(authUser))
    } else {
      const authUser: AuthUser = { id: 'demo-user', email, name: email.split('@')[0] }
      setUser(authUser)
      localStorage.setItem('sc-user', JSON.stringify(authUser))
    }
  }

  const logout = () => {
    if (SKIP_CLOUD_ENABLED) skipCloud.logout()
    setUser(null)
    localStorage.removeItem('sc-user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuthStore() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider')
  return ctx
}

export default useAuthStore
