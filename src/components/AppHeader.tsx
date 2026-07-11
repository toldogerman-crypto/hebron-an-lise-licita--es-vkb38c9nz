import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'

export function AppHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/nova-oportunidade':
        return 'Nova Oportunidade'
      case '/radar':
        return 'Radar de Licitações'
      default:
        if (location.pathname.startsWith('/oportunidade/')) {
          return 'Detalhes da Oportunidade'
        }
        return 'Sistema Hebron'
    }
  }

  return (
    <div className="sticky top-0 z-20 w-full flex flex-col">
      {!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SKIP_CLOUD && (
        <div className="bg-amber-100 text-amber-800 text-xs px-4 py-1.5 text-center font-medium border-b border-amber-200 shadow-sm">
          ⚠️ Aviso: Backend não conectado. Os dados do pipeline estão salvos apenas no armazenamento
          local e podem ser perdidos.
        </div>
      )}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 shadow-sm w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg text-slate-900 hidden sm:block">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end max-w-md">
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar edital, órgão ou ID..."
              className="w-full pl-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-300"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-slate-500 shrink-0">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-rose-500 rounded-full animate-pulse-subtle"></span>
          </Button>
        </div>
      </header>
    </div>
  )
}
