import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect } from 'react'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import NewOpportunity from './pages/NewOpportunity'
import Radar from './pages/Radar'
import OpportunityDetail from './pages/OpportunityDetail'
import Configuracoes from './pages/Configuracoes'
import Login from './pages/Login'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MainProvider } from '@/stores/main'
import { ConfigProvider } from '@/stores/config'
import { AuthProvider } from '@/hooks/use-auth'
import useMainStore from '@/stores/main'

function MainWrapper({ children }: { children: React.ReactNode }) {
  const { refreshOpportunities } = useMainStore()
  useEffect(() => {
    refreshOpportunities()
  }, [refreshOpportunities])
  return <>{children}</>
}

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConfigProvider>
        <AuthProvider>
          <MainProvider>
            <MainWrapper>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/nova-oportunidade" element={<NewOpportunity />} />
                    <Route path="/radar" element={<Radar />} />
                    <Route path="/oportunidade/:id" element={<OpportunityDetail />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainWrapper>
          </MainProvider>
        </AuthProvider>
      </ConfigProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
