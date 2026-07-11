import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockOpportunities } from '@/lib/mock-data'
import { StatusBadge } from '@/components/StatusBadge'
import { Search, Filter, RefreshCcw, LayoutList, KanbanSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

export default function Radar() {
  const [view, setView] = useState<'list' | 'kanban'>('kanban')
  const { toast } = useToast()

  const handleSync = () => {
    toast({
      title: 'Sincronização Iniciada',
      description: 'Atualizando dados com a Planilha Mestra...',
    })
  }

  const columns = ['Em Análise', 'Entrar', 'Analisar Mais', 'Não Entrar']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Radar de Licitações</h1>
          <p className="text-slate-500">Acompanhe o pipeline de oportunidades ativas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSync} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Sincronizar
          </Button>
          <Button asChild>
            <Link to="/nova-oportunidade">Nova Licitação</Link>
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4 border-b">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar no radar..." className="pl-9 bg-slate-50" />
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <div className="ml-auto hidden sm:block border-l pl-4 border-slate-200">
            <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'kanban')}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="kanban" className="gap-2">
                  <KanbanSquare className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <LayoutList className="h-4 w-4" />
                  Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>

        {view === 'kanban' && (
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {columns.map((col) => (
                <div key={col} className="w-80 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-semibold text-slate-700">{col}</h3>
                    <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {
                        mockOpportunities.filter((o) => o.status === col || o.verdict === col)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 bg-slate-50/50 p-2 rounded-xl min-h-[500px]">
                    {mockOpportunities
                      .filter((o) => (col === 'Em Análise' ? o.status === col : o.verdict === col))
                      .map((opp) => (
                        <Card
                          key={opp.id}
                          className="shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <Link to={`/oportunidade/${opp.id}`}>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-xs font-medium text-slate-500">
                                  {opp.number}
                                </span>
                                {opp.score > 0 && (
                                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    Score: {opp.score}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm text-slate-900 line-clamp-2 leading-tight">
                                {opp.title}
                              </p>
                              <div className="text-xs text-slate-500 truncate">{opp.organ}</div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Objeto</th>
                  <th className="px-6 py-4 font-medium">Órgão</th>
                  <th className="px-6 py-4 font-medium">Status / Veredicto</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{opp.title}</div>
                      <div className="text-xs text-slate-500">{opp.number}</div>
                    </td>
                    <td className="px-6 py-4">{opp.organ}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={opp.status} />
                        {opp.verdict !== 'Pendente' && <StatusBadge verdict={opp.verdict} />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{opp.score || '-'}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/oportunidade/${opp.id}`}>Ver Detalhes</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
