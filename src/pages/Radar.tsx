import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
import { Trash2, Plus, Target, Archive, RefreshCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Opportunity } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const PIPELINE_COLS = [
  {
    id: 'interesse',
    label: 'Interesse',
    color: '#B8860B',
    desc: 'Sob análise para futura participação',
  },
  {
    id: 'aguardando',
    label: 'Aguardando Abertura',
    color: '#2563EB',
    desc: 'Aguardando a sessão pública',
  },
  { id: 'sessao', label: 'Em Sessão', color: '#0D6E3F', desc: 'Em disputa ativa' },
  { id: 'finalizado', label: 'Finalizado', color: '#6B7280', desc: 'Certames encerrados' },
]

export default function Radar() {
  const { toast } = useToast()
  const { opportunities, updateOpportunity, deleteAllOpportunities } = useMainStore()
  const [modalProc, setModalProc] = useState<Opportunity | null>(null)

  const handleDeleteAll = () => {
    deleteAllOpportunities()
    toast({
      title: 'Dados Excluídos',
      description: 'Todos os processos foram removidos do pipeline.',
    })
  }

  const handleMove = (id: string, dir: number) => {
    const opp = opportunities.find((o) => o.id === id)
    if (!opp) return
    const idx = PIPELINE_COLS.findIndex((c) => c.id === opp.status)
    const nextCol = PIPELINE_COLS[idx + dir]
    if (!nextCol) return

    if (nextCol.id === 'finalizado') {
      setModalProc(opp)
      return
    }
    updateOpportunity(id, { status: nextCol.id as any })
  }

  const isEmpty = opportunities.length === 0

  return (
    <div className="space-y-6 h-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Central de Licitações</h1>
          <p className="text-slate-500">Acompanhe e gerencie o ciclo de vida dos seus processos.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                disabled={isEmpty}
              >
                <Trash2 className="h-4 w-4" />
                Limpar Pipeline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir todos os processos?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível. Todos os dados, análises e históricos serão apagados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  Sim, excluir tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button asChild className="bg-[#2563EB] hover:bg-blue-700">
            <Link to="/nova-oportunidade">
              <Plus className="w-4 h-4 mr-2" /> Analisar Edital
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6 h-auto">
          <TabsTrigger value="pipeline" className="gap-2 py-2 px-6 font-display font-semibold">
            <Target className="w-4 h-4" /> Pipeline
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2 py-2 px-6 font-display font-semibold">
            <Archive className="w-4 h-4" /> Histórico de Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-0 outline-none">
          {isEmpty ? (
            <div className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <RefreshCcw className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                Nenhum processo no pipeline
              </h3>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                Analise um edital na aba "Nova Oportunidade" e toque em "Enviar ao Pipeline".
              </p>
              <Button asChild>
                <Link to="/nova-oportunidade">Começar Análise</Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start">
              {PIPELINE_COLS.map((col, colIdx) => {
                const list = opportunities.filter((o) => o.status === col.id)
                return (
                  <div
                    key={col.id}
                    className="min-w-[280px] w-[280px] shrink-0 bg-white border border-slate-200 rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold font-display text-slate-900">
                        {col.label}
                      </span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {list.length}
                      </span>
                    </div>
                    <div
                      style={{ height: 3, backgroundColor: col.color }}
                      className="rounded-full w-full mb-3"
                    />
                    <p className="text-[11px] text-slate-400 mb-4 leading-tight">{col.desc}</p>

                    <div className="space-y-3 min-h-[100px]">
                      {list.length === 0 && (
                        <div className="border-2 border-dashed border-slate-100 rounded-lg p-6 text-center text-xs text-slate-400 font-medium">
                          Vazio
                        </div>
                      )}
                      {list.map((p) => (
                        <Card
                          key={p.id}
                          className="p-3 shadow-sm border-slate-200 hover:border-slate-300 transition-colors bg-[#FAFAFA]"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <Link
                              to={`/oportunidade/${p.id}`}
                              className="font-bold text-[13px] text-slate-900 hover:text-blue-600 line-clamp-1 flex-1"
                            >
                              {p.number}
                            </Link>
                            {p.score > 0 && (
                              <StatusBadge
                                verdict={p.verdict}
                                className="text-[10px] px-1.5 py-0 rounded"
                              />
                            )}
                          </div>
                          <div className="text-[11.5px] text-slate-500 mb-2 truncate">
                            {p.organ} • {p.city}
                          </div>
                          {p.dueDate && (
                            <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                              📅 {p.dueDate}
                            </div>
                          )}
                          <div className="flex gap-2 mt-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 flex-1 text-xs px-2"
                              disabled={colIdx === 0}
                              onClick={() => handleMove(p.id, -1)}
                            >
                              ◀
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 flex-1 text-xs px-2"
                              disabled={colIdx === PIPELINE_COLS.length - 1}
                              onClick={() => handleMove(p.id, 1)}
                            >
                              ▶
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="mt-0 outline-none">
          <HistoricoTab opportunities={opportunities} onEdit={(o) => setModalProc(o)} />
        </TabsContent>
      </Tabs>

      {modalProc && (
        <ResultModal
          proc={modalProc}
          onClose={() => setModalProc(null)}
          onSave={(data) => {
            updateOpportunity(modalProc.id, {
              status: 'finalizado',
              resultado: data.resultado,
              valorHomologado: data.valorHomologado,
              aprendizado: data.aprendizado,
            })
            setModalProc(null)
          }}
        />
      )}
    </div>
  )
}

function HistoricoTab({
  opportunities,
  onEdit,
}: {
  opportunities: Opportunity[]
  onEdit: (o: Opportunity) => void
}) {
  const fin = opportunities.filter((o) => o.status === 'finalizado')
  const ganhos = fin.filter((o) => o.resultado === 'ganhou')
  const perdidos = fin.filter((o) => o.resultado === 'perdeu')
  const base = ganhos.length + perdidos.length
  const pctG = base ? ((ganhos.length / base) * 100).toFixed(1) : '0.0'

  if (fin.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
        Nenhum certame finalizado ainda. <br />
        Quando um processo chegar em "Finalizado", ele aparecerá aqui com o resultado.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm border-slate-200">
          <div className="text-[11px] font-bold tracking-wider text-[#2563EB] mb-2 uppercase">
            Total Ganhei
          </div>
          <div className="text-2xl font-black font-display text-slate-900">{ganhos.length}</div>
          <div className="text-xs text-slate-500 mt-1">{pctG}% de vitória</div>
        </Card>
        <Card className="p-4 shadow-sm border-slate-200">
          <div className="text-[11px] font-bold tracking-wider text-slate-500 mb-2 uppercase">
            Total Perdi
          </div>
          <div className="text-2xl font-black font-display text-slate-900">{perdidos.length}</div>
        </Card>
        <Card className="p-4 shadow-sm border-slate-200 md:col-span-2">
          <div className="text-[11px] font-bold tracking-wider text-[#0D6E3F] mb-2 uppercase">
            Valor Total Homologado
          </div>
          <div className="text-2xl font-black font-display text-slate-900">
            Consolidado em Resultados
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Acompanhe os valores nas propostas abaixo
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {fin.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:border-slate-300 transition-colors"
          >
            <div className="flex-1">
              <Link
                to={`/oportunidade/${p.id}`}
                className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {p.number} · {p.organ}
              </Link>
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{p.title}</p>
              {p.aprendizado && (
                <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg mt-3 font-medium">
                  💡 {p.aprendizado}
                </div>
              )}
            </div>
            <div className="text-right shrink-0 min-w-[120px]">
              <StatusBadge resultado={p.resultado} className="mb-2 block w-max ml-auto" />
              {p.valorHomologado && (
                <div className="text-sm font-bold text-slate-900">R$ {p.valorHomologado}</div>
              )}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-slate-400 mt-1"
                onClick={() => onEdit(p)}
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultModal({ proc, onSave, onClose }: any) {
  const [res, setRes] = useState<any>(proc.resultado || '')
  const [val, setVal] = useState(proc.valorHomologado || '')
  const [apr, setApr] = useState(proc.aprendizado || '')

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Registrar Resultado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {proc.number} · {proc.organ}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ganhou', label: 'Ganhou', color: '#0D6E3F' },
              { id: 'perdeu', label: 'Perdeu', color: '#8B1A1A' },
              { id: 'nao_participou', label: 'Não Entrou', color: '#6B7280' },
            ].map((o) => (
              <Button
                key={o.id}
                variant="outline"
                onClick={() => setRes(o.id)}
                className={`h-10 text-xs ${res === o.id ? 'border-2' : ''}`}
                style={{
                  borderColor: res === o.id ? o.color : undefined,
                  color: res === o.id ? o.color : undefined,
                }}
              >
                {o.label}
              </Button>
            ))}
          </div>
          {res && res !== 'nao_participou' && (
            <div className="space-y-2">
              <Label>Valor do vencedor (R$) - Opcional</Label>
              <Input
                placeholder="Ex: 45.900,00"
                value={val}
                onChange={(e) => setVal(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Aprendizado (O que faríamos diferente?)</Label>
            <Textarea
              rows={3}
              placeholder="Escreva lições aprendidas..."
              value={apr}
              onChange={(e) => setApr(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => onSave({ resultado: res, valorHomologado: val, aprendizado: apr })}
            disabled={!res}
          >
            Salvar Resultado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
