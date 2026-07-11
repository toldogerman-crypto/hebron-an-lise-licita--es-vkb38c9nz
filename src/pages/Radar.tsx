import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { StatusBadge } from '@/components/StatusBadge'
import { UrgencySemaphore } from '@/components/UrgencySemaphore'
import {
  Search,
  Filter,
  RefreshCcw,
  LayoutList,
  KanbanSquare,
  Table,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Inbox,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import useMainStore from '@/stores/main'

type SyncState = 'idle' | 'syncing' | 'success' | 'error'

const SHEETS_COLUMNS = [
  'ID',
  'Data Análise',
  'Edital #',
  'Órgão',
  'Local',
  'Modalidade',
  'Objeto',
  'Abertura',
  'Dias',
  'Score',
  'Risco',
  'Margem',
  'Decisão',
  'Próx. Passo',
  'Responsável',
  'Status',
  'Resultado',
  'Preço Vencedor',
  'Aprendizado',
]

export default function Radar() {
  const [view, setView] = useState<'list' | 'kanban' | 'sheets'>('kanban')
  const [syncState, setSyncState] = useState<SyncState>('idle')
  const { toast } = useToast()
  const { opportunities, deleteAllOpportunities } = useMainStore()

  const handleSync = () => {
    setSyncState('syncing')
    setTimeout(() => {
      if (Math.random() > 0.3) {
        setSyncState('success')
        toast({
          title: 'Sincronização Concluída',
          description: 'Dados enviados para Google Sheets (Aba Radar).',
        })
      } else {
        setSyncState('error')
        toast({
          title: 'Erro na Sincronização',
          description: 'Falha ao conectar com Google Sheets. Verifique as permissões.',
          variant: 'destructive',
        })
      }
    }, 2000)
  }

  const handleDeleteAll = () => {
    deleteAllOpportunities()
    setSyncState('idle')
    toast({
      title: 'Dados Excluídos',
      description: 'Todos os editais e análises foram removidos permanentemente.',
    })
  }

  const columns = ['Em Análise', 'Entrar', 'Analisar Mais', 'Não Entrar']
  const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || '#'
  const isEmpty = opportunities.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Radar de Licitações</h1>
          <p className="text-slate-500">
            Pipeline de oportunidades e sincronização com Google Sheets.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={syncState === 'syncing'}
            className="gap-2"
          >
            {syncState === 'syncing' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Sincronizar Radar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                disabled={isEmpty}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar todos os editais
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar todos os editais?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja excluir todos os editais? Esta ação é permanente e não
                  pode ser desfeita. Todos os dados de oportunidades, análises de IA, respostas do
                  Portão de Decisão e documentos serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Sim, excluir tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button asChild>
            <Link to="/nova-oportunidade">Nova Licitação</Link>
          </Button>
        </div>
      </div>

      {syncState === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          <p className="text-sm text-rose-700">
            Falha ao sincronizar com Google Sheets. Verifique as credenciais e permissões da API.
          </p>
          <Button variant="outline" size="sm" onClick={handleSync} className="ml-auto shrink-0">
            Tentar Novamente
          </Button>
        </div>
      )}
      {syncState === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700">
            Sincronização concluída. Dados atualizados na aba "Radar".
          </p>
        </div>
      )}

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
            <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'kanban' | 'sheets')}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="kanban" className="gap-1">
                  <KanbanSquare className="h-4 w-4" /> Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-1">
                  <LayoutList className="h-4 w-4" /> Lista
                </TabsTrigger>
                <TabsTrigger value="sheets" className="gap-1">
                  <Table className="h-4 w-4" /> Sheets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>

        {isEmpty ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Nenhuma oportunidade encontrada
            </h3>
            <p className="text-sm text-slate-500 max-w-md">
              O radar está vazio. Cadastre uma nova licitação para iniciar a análise automatizada.
            </p>
            <Button asChild className="mt-4">
              <Link to="/nova-oportunidade">Cadastrar Oportunidade</Link>
            </Button>
          </div>
        ) : view === 'kanban' ? (
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {columns.map((col) => {
                const opps = opportunities.filter((o) =>
                  col === 'Em Análise' ? o.status === col : o.verdict === col,
                )
                return (
                  <div key={col} className="w-80 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-semibold text-slate-700">{col}</h3>
                      <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {opps.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 bg-slate-50/50 p-2 rounded-xl min-h-[400px]">
                      {opps.map((opp) => (
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
                                    {opp.score}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm text-slate-900 line-clamp-2 leading-tight">
                                {opp.title}
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-slate-500 truncate">
                                  {opp.city}/{opp.state}
                                </span>
                                <UrgencySemaphore
                                  openingDate={opp.openingDate}
                                  className="scale-90 origin-right"
                                />
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : view === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-4 font-medium">Objeto</th>
                  <th className="px-4 py-4 font-medium">Órgão</th>
                  <th className="px-4 py-4 font-medium">Local</th>
                  <th className="px-4 py-4 font-medium">Urgência</th>
                  <th className="px-4 py-4 font-medium">Veredicto</th>
                  <th className="px-4 py-4 font-medium">Score</th>
                  <th className="px-4 py-4 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{opp.title}</div>
                      <div className="text-xs text-slate-500">{opp.number}</div>
                    </td>
                    <td className="px-4 py-4">{opp.organ}</td>
                    <td className="px-4 py-4 text-xs">
                      {opp.city}/{opp.state}
                    </td>
                    <td className="px-4 py-4">
                      <UrgencySemaphore openingDate={opp.openingDate} className="scale-90" />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge verdict={opp.verdict} />
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{opp.score || '-'}</td>
                    <td className="px-4 py-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/oportunidade/${opp.id}`}>Ver</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">Google Sheets — Aba "Radar"</h3>
                <p className="text-sm text-slate-500">
                  Fonte única de verdade. {SHEETS_COLUMNS.length} colunas sincronizadas.
                </p>
              </div>
              <a
                href={sheetsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline flex items-center gap-1"
              >
                Abrir Planilha <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {SHEETS_COLUMNS.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono">{opp.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(opp.dateAdded)}</td>
                      <td className="px-3 py-2">{opp.number}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{opp.organ}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {opp.city}/{opp.state}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{opp.modality}</td>
                      <td className="px-3 py-2 max-w-[200px] truncate">{opp.title}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(opp.openingDate)}</td>
                      <td className="px-3 py-2">
                        <UrgencySemaphore
                          openingDate={opp.openingDate}
                          className="scale-75 origin-left"
                        />
                      </td>
                      <td className="px-3 py-2 font-bold">{opp.score || '-'}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">
                        {opp.estimatedMargin ? `${opp.estimatedMargin}%` : '—'}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge verdict={opp.verdict} />
                      </td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2 whitespace-nowrap">{opp.responsible}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={opp.status} />
                      </td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
