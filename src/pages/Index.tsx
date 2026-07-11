import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { Plus, Search, Trash2, FileText } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useMainStore from '@/stores/main'
import { OpportunityStatus } from '@/lib/types'
import { formatDate, getDaysUntil } from '@/lib/utils'

const STATUS_TABS: { value: OpportunityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'recebida', label: 'Recebida' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aguardando_decisao', label: 'Aguardando Decisão' },
  { value: 'em_preparacao', label: 'Em Preparação' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'encerrada', label: 'Encerrada' },
]

export default function Index() {
  const { opportunities, deleteOpportunity } = useMainStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        !search ||
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.number.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || opp.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [opportunities, search, statusFilter])

  const confirmDelete = () => {
    if (deleteId) deleteOpportunity(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Visão geral das oportunidades de licitação.</p>
        </div>
        <Button asChild className="bg-[#2563EB] hover:bg-blue-700">
          <Link to="/nova-oportunidade">
            <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUS_TABS.slice(1, 5).map((tab) => {
          const count = opportunities.filter((o) => o.status === tab.value).length
          return (
            <Card key={tab.value} className="p-4 shadow-sm border-slate-200">
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
                {tab.label}
              </div>
              <div className="text-2xl font-black font-display text-slate-900">{count}</div>
            </Card>
          )
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por título ou número do edital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(tab.value)}
            className={statusFilter === tab.value ? 'bg-[#2563EB]' : ''}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {opportunities.filter((o) => o.status === tab.value).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FileText className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            {opportunities.length === 0
              ? 'Nenhuma oportunidade cadastrada'
              : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            {opportunities.length === 0
              ? 'Comece criando sua primeira oportunidade de licitação.'
              : 'Tente ajustar a busca ou os filtros.'}
          </p>
          {opportunities.length === 0 && (
            <Button asChild>
              <Link to="/nova-oportunidade">
                <Plus className="w-4 h-4 mr-2" /> Criar Oportunidade
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <Card className="shadow-sm overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Nº Edital</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Título</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">
                    Órgão
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 hidden lg:table-cell">
                    Abertura
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((opp) => {
                  const days = getDaysUntil(opp.openingDate)
                  return (
                    <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          to={`/oportunidade/${opp.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600"
                        >
                          {opp.number || '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <Link
                          to={`/oportunidade/${opp.id}`}
                          className="text-slate-700 hover:text-blue-600 line-clamp-1"
                        >
                          {opp.title}
                        </Link>
                        {opp.city && opp.state && (
                          <span className="text-xs text-slate-400 block">
                            {opp.city}/{opp.state}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                        {opp.organ || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                        {opp.openingDate ? formatDate(opp.openingDate) : '—'}
                        {days >= 0 && days <= 7 && opp.status !== 'encerrada' && (
                          <span className="text-xs text-rose-500 block font-medium">
                            {days === 0 ? 'Hoje' : `${days} dias`}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={opp.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-rose-600"
                          onClick={() => setDeleteId(opp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir oportunidade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Todos os dados e documentos serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
