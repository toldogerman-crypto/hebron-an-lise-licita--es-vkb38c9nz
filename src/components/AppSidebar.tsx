import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar'
import { LayoutDashboard, PlusCircle, Radar, Settings, ShieldCheck, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'Nova Oportunidade', path: '/nova-oportunidade' },
    { icon: Radar, label: 'Radar / Pipeline', path: '/radar' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 shadow-sm">
      <SidebarHeader className="border-b border-slate-100 p-4 h-16 flex items-center justify-center">
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
            <ShieldCheck size={24} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 truncate">
              <span className="font-bold text-sm tracking-tight text-slate-900 leading-none mb-1">
                HEBRON
              </span>
              <span className="text-[10px] uppercase text-slate-500 font-medium tracking-wider leading-none">
                Consultorias
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="pt-4">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                      <Link
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 transition-colors',
                          isActive ? 'text-primary font-medium' : 'text-slate-600',
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-9 w-9 shrink-0 border border-slate-200">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
            <AvatarFallback>HC</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-sm font-medium text-slate-900 truncate">Carlos Eduardo</span>
              <span className="text-xs text-slate-500 truncate">Analista Sênior</span>
            </div>
          )}
          {!isCollapsed && (
            <button className="text-slate-400 hover:text-slate-600 ml-auto shrink-0">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
