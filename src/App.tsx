import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import NewOpportunity from './pages/NewOpportunity'
import Radar from './pages/Radar'
import OpportunityDetail from './pages/OpportunityDetail'
import Configuracoes from './pages/Configuracoes'
import { MainProvider } from '@/stores/main'
import { ConfigProvider } from '@/stores/config'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConfigProvider>
        <MainProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/nova-oportunidade" element={<NewOpportunity />} />
              <Route path="/radar" element={<Radar />} />
              <Route path="/oportunidade/:id" element={<OpportunityDetail />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainProvider>
      </ConfigProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
