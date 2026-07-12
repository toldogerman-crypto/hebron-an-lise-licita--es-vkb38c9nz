import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { AlertTriangle, Copy, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { MotorScore, KnockoutCheck, MotorDecision } from '@/lib/types'
import { cn } from '@/lib/utils'

const chartConfig = { score: { label: 'Score', color: 'hsl(184 100% 20%)' } } satisfies ChartConfig

interface DecisionMotorProps {
  score?: MotorScore
  knockouts?: KnockoutCheck[]
  decision?: MotorDecision
  memo?: string
  iaScore?: number
}

export function DecisionMotor({
  score,
  knockouts = [],
  decision,
  memo,
  iaScore,
}: DecisionMotorProps) {
  const { toast } = useToast()
  const hasKnockout = knockouts.some((k) => k.triggered)
  const effectiveDecision = hasKnockout ? 'NO_GO' : decision

  const chartData = score
    ? [
        { dimension: 'Elegibilidade', value: score.elegibilidade, fullMark: 100 },
        { dimension: 'Prazo', value: score.prazo, fullMark: 100 },
        { dimension: 'Financeiro', value: score.financeiro, fullMark: 100 },
        { dimension: 'Execução', value: score.execucao, fullMark: 100 },
      ]
    : []

  const decisionConfig: Record<
    string,
    { label: string; class: string; icon: typeof CheckCircle2 }
  > = {
    GO: { label: 'GO', class: 'bg-[#0D6E3F] text-white', icon: CheckCircle2 },
    GO_CONDICIONAL: {
      label: 'GO CONDICIONAL',
      class: 'bg-[#B8860B] text-white',
      icon: AlertTriangle,
    },
    NO_GO: { label: 'NO-GO', class: 'bg-[#8B1A1A] text-white', icon: XCircle },
  }
  const dc = decisionConfig[effectiveDecision || 'NO_GO'] || decisionConfig.NO_GO
  const Icon = dc.icon

  const copyMemo = () => {
    if (memo) {
      navigator.clipboard.writeText(memo)
      toast({ title: 'Memo Executivo copiado!' })
    }
  }

  return (
    <div className="space-y-6">
      {hasKnockout && (
        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-[#B91C1C] shrink-0" />
          <div>
            <h4 className="font-bold text-[#7F1D1D]">Knockout Ativado — Decisão: NO-GO</h4>
            <p className="text-sm text-[#991B1B] mt-1">
              {knockouts
                .filter((k) => k.triggered)
                .map((k) => k.label)
                .join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base">Radar de Decisão (4 Dimensões)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 12, fill: 'hsl(200 10% 45%)' }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    dataKey="value"
                    stroke="hsl(184 100% 20%)"
                    fill="hsl(184 100% 20%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Sem dados de score ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base">Scores & Decisão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Score Estratégico (IA)
                </p>
                <p className="text-3xl font-black font-display text-slate-900 mt-1">
                  {iaScore ?? '—'}
                </p>
              </div>
              <div className="bg-[#005f66]/5 rounded-lg p-4 text-center border border-[#005f66]/20">
                <p className="text-[10px] uppercase font-bold text-[#005f66] tracking-wider">
                  Score de Decisão (Motor)
                </p>
                <p className="text-3xl font-black font-display text-[#005f66] mt-1">
                  {score?.total ?? '—'}
                </p>
              </div>
            </div>

            <div className={cn('flex items-center gap-3 p-4 rounded-lg', dc.class)}>
              <Icon className="h-6 w-6" />
              <span className="text-lg font-bold font-display">{dc.label}</span>
            </div>

            {knockouts.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Knockouts Verificados
                </p>
                {knockouts.map((k) => (
                  <div key={k.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{k.label}</span>
                    <span
                      className={cn(
                        'font-bold',
                        k.triggered ? 'text-rose-600' : 'text-emerald-600',
                      )}
                    >
                      {k.triggered ? '✗ Ativado' : '✓ OK'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {memo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Memo Executivo
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyMemo}
                    className="h-7 gap-1 text-xs"
                  >
                    <Copy className="h-3 w-3" /> Copiar
                  </Button>
                </div>
                <div className="bg-slate-900 text-slate-200 text-sm p-4 rounded-lg font-mono leading-relaxed whitespace-pre-wrap">
                  {memo}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
