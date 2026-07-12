import { useState, useEffect, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'

interface BackendHealthState {
  isConnected: boolean
  isChecking: boolean
  check: () => Promise<void>
}

export function useBackendHealth(): BackendHealthState {
  const baseUrl = import.meta.env.VITE_POCKETBASE_URL
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const check = useCallback(async () => {
    if (!baseUrl) {
      setIsConnected(false)
      setIsChecking(false)
      return
    }
    try {
      const res = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      setIsConnected(res.ok)
    } catch {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }, [baseUrl])

  useEffect(() => {
    check()
    const interval = setInterval(() => {
      check()
    }, 30000)
    return () => clearInterval(interval)
  }, [check])

  return { isConnected, isChecking, check }
}
