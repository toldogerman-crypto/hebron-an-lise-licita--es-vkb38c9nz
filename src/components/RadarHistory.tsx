import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { Link } from 'react-router-dom'
import { Opportunity } from '@/lib/types'

interface RadarHistoryProps {
  opportunities: Opportunity[]
  onEdit: (o: Opportunity) => void
  onDelete: (id: string) => void
}

export function RadarHistory({ opportunities, onEdit, onDelete }: RadarHistoryProps) {
  const fin = opportunities.filter((o) => o.status === 'encerrada')
  const ganhos = fin.filter((o) => o.resultado === 'ganhou')
  const perdidos = fin.filter((o) => o.resultado === 'perdeu')
  const base = ganhos.length + perdidos.length
  const pctG = base ? ((ganhos.length / base) * 100).toFixed(1) : '0.0'

  if (fin.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
        Nenhum certame encerrado ainda. <br />
        Quando um processo chegar em "Encerrada", ele aparecerá aqui com o resultado.
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
              <div className="flex items-center gap-3 justify-end mt-1">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-slate-400"
                  onClick={() => onEdit(p)}
                >
                  Editar
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-rose-400 hover:text-rose-600"
                  onClick={() => onDelete(p.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
