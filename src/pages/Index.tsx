import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Target, CheckCircle2, Clock, ArrowRight, AlertCircle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import useMainStore from '@/stores/main'

export default function Index() {
  const { opportunities } = useMainStore()
  const recentOpps = opportunities.slice(0, 4)
  const isEmpty = opportunities.length === 0
  const inPipeline = opportunities.filter((o) => o.status !== 'finalizado').length
  const favorable = opportunities.filter((o) => o.verdict === 'ENTRAR').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Oportunidades"
          value={String(opportunities.length)}
          icon={Target}
          trend={isEmpty ? 'Nenhuma oportunidade' : '+12% que mês passado'}
        />
        <MetricCard
          title="Pipeline Ativo"
          value={String(inPipeline)}
          icon={Clock}
          trend={isEmpty ? '—' : 'Processos em andamento'}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Decisões Favoráveis"
          value={String(favorable)}
          icon={CheckCircle2}
          trend={isEmpty ? '—' : 'Recomendado participar'}
          iconColor="text-emerald-500"
        />
        <MetricCard
          title="Próximos Prazos"
          value={
            isEmpty ? '0' : String(opportunities.filter((o) => o.status === 'aguardando').length)
          }
          icon={AlertCircle}
          trend={isEmpty ? '—' : 'Aguardando abertura'}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-slate-800">Atividade Recente</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/radar">Ver Pipeline Completo</Link>
            </Button>
          </div>
          {isEmpty ? (
            <Card className="border-slate-200 shadow-sm">
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  Nenhuma oportunidade encontrada
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  Nenhum edital analisado ainda. O sistema está aguardando seus dados reais.
                </p>
                <Button asChild className="mt-4 bg-[#2563EB]">
                  <Link to="/nova-oportunidade">Fazer Upload de Edital</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <div className="divide-y divide-slate-100">
                {recentOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <Link
                        to={`/oportunidade/${opp.id}`}
                        className="font-semibold font-display text-slate-900 hover:text-blue-600 hover:underline transition-all"
                      >
                        {opp.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{opp.number}</span>
                        <span>•</span>
                        <span>{opp.organ}</span>
                        <span>•</span>
                        <span>{opp.modality}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={opp.status} />
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/oportunidade/${opp.id}`}>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-display text-slate-800">Ações Rápidas</h2>
          <Card className="border-slate-200 bg-[#2563EB] text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-display text-white">Nova Licitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-blue-100 text-sm">
                Faça o upload do edital para iniciar a análise automatizada via IA (Hebron v6).
              </p>
              <Button
                className="w-full bg-white text-blue-700 hover:bg-slate-100 shadow-sm font-semibold"
                asChild
              >
                <Link to="/nova-oportunidade">Analisar Edital</Link>
              </Button>
            </CardContent>
          </Card>

          {!isEmpty && (
            <Card className="border-rose-200 bg-rose-50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Ação Requerida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-rose-700 mb-3">
                  Existem editais aguardando aprovação no Portão de Decisão.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full border-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  <Link to="/radar">Ir para o Pipeline</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-slate-500',
}: {
  title: string
  value: string
  icon: any
  trend: string
  iconColor?: string
}) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-semibold font-display text-slate-600">{title}</p>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900">{value}</h2>
          <p className="text-xs text-slate-500 font-medium">{trend}</p>
        </div>
      </CardContent>
    </Card>
  )
}
