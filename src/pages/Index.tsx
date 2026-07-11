import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Target, CheckCircle2, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { mockOpportunities } from '@/lib/mock-data'
import { StatusBadge } from '@/components/StatusBadge'

export default function Index() {
  const recentOpps = mockOpportunities.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Oportunidades"
          value="124"
          icon={Target}
          trend="+12% que mês passado"
        />
        <MetricCard
          title="Em Análise (IA)"
          value="8"
          icon={Clock}
          trend="Tempo médio: 4m"
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Decisões Favoráveis"
          value="45"
          icon={CheckCircle2}
          trend="36% de aprovação"
          iconColor="text-emerald-500"
        />
        <MetricCard
          title="Próximos Prazos"
          value="3"
          icon={AlertCircle}
          trend="Nas próximas 24h"
          iconColor="text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Atividade Recente</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/radar">Ver Pipeline Completo</Link>
            </Button>
          </div>
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
                      className="font-medium text-slate-900 hover:text-primary hover:underline transition-all"
                    >
                      {opp.title}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
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
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Ações Rápidas</h2>
          <Card className="border-slate-200 bg-primary text-primary-foreground shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">Nova Licitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-slate-300 text-sm">
                Faça o upload do edital e anexos para iniciar a análise automatizada via IA.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-slate-100 shadow-sm" asChild>
                <Link to="/nova-oportunidade">Cadastrar Oportunidade</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ação Requerida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-rose-700 mb-3">
                2 editais estão com a documentação incompleta impedindo a análise técnica.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-rose-200 text-rose-700 hover:bg-rose-100"
              >
                Revisar Documentos
              </Button>
            </CardContent>
          </Card>
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
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h2>
          <p className="text-xs text-slate-500 font-medium">{trend}</p>
        </div>
      </CardContent>
    </Card>
  )
}
