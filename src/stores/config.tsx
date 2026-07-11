import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface SystemConfig {
  minMargin: number
  minDeadlineDays: number
  priorityCNAEs: string[]
  prioritySegments: string[]
  exclusionRules: string[]
  priorityRegions: string[]
}

const DEFAULT_CONFIG: SystemConfig = {
  minMargin: 15,
  minDeadlineDays: 3,
  priorityCNAEs: [
    '6201-5/01 - Desenvolvimento de Software',
    '6202-3/01 - Consultoria em TI',
    '6311-9/00 - Tratamento de Dados',
  ],
  prioritySegments: ['Tecnologia', 'Higiene', 'Mobiliário', 'Consultoria'],
  exclusionRules: [
    'Engenharia Civil Pesada',
    'Combustíveis e Lubrificantes',
    'Licitação Internacional',
  ],
  priorityRegions: ['Sul', 'Sudeste'],
}

const STORAGE_KEY = 'hebron-config-v1'

interface ConfigStoreValue {
  config: SystemConfig
  updateConfig: (data: Partial<SystemConfig>) => void
  resetConfig: () => void
}

const ConfigContext = createContext<ConfigStoreValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(data) })
      }
    } catch {
      // use defaults
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    }
  }, [config, isLoaded])

  const updateConfig = (data: Partial<SystemConfig>) => {
    setConfig((prev) => ({ ...prev, ...data }))
  }

  const resetConfig = () => setConfig(DEFAULT_CONFIG)

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {isLoaded ? children : null}
    </ConfigContext.Provider>
  )
}

function useConfigStore() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfigStore must be used within ConfigProvider')
  return ctx
}

export default useConfigStore
