import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signUp: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

function recordToUser(record: any): AuthUser | null {
  if (!record) return null
  return { id: record.id, email: record.email || '', name: record.name || record.email }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(
    pb.authStore.isValid ? recordToUser(pb.authStore.record) : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? recordToUser(record) : null)
      setIsAuthenticated(pb.authStore.isValid)
    })
    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setIsLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setIsLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    await pb.collection('users').authWithPassword(email, password)
  }

  const logout = () => {
    pb.authStore.clear()
  }

  const signUp = async (email: string, password: string) => {
    await pb
      .collection('users')
      .create({ email, password, passwordConfirm: password, name: email.split('@')[0] })
    await pb.collection('users').authWithPassword(email, password)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}
