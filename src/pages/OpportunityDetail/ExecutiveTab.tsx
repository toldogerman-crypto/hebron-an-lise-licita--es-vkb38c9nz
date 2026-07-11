import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, FileText, Lightbulb, ShieldAlert } from 'lucide-react'
import { AnalysisResult } from '@/lib/types'
import { ScoreBreakdown } from '@/components/ScoreBreakdown'
import { formatCurrency, cn } from '@/lib/utils'

interface ExecutiveTabProps {
  analysis?: AnalysisResult
}

export function ExecutiveTab({ analysis }: ExecutiveTabProps) {
  if (!analysis) {
    return <div className="mt-6 text-center py-12 text-slate-500">Análise não disponível.</div>
  }

  const severityConfig = {
    high: 'text-rose-600 bg-rose-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-slate-600 bg-slate-50',
  }
  const totalValue = analysis.items.reduce((sum, i) => sum + i.estimatedValue * i.quantity, 0)

  return (
    <div className="mt-6 space-y-6">
      {analysis.alerts.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-rose-700">
              <ShieldAlert className="h-4 w-4" /> Alertas de Impugnação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-white border border-rose-100 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{alert.clause}</p>
                  <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-rose-600 font-medium">
                      Prazo: {alert.deadline}
                    </span>
                    <span className="text-xs text-blue-500 bg-blue-50 px-1 rounded">
                      {alert.source}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" /> 1. Sumário Executivo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">{analysis.summary}</p>
            <ScoreBreakdown items={analysis.scoreItems} total={analysis.scoreTotal} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 2. Análise Técnica
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">{analysis.technicalAnalysis}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500">Itens Extraídos</span>
                <p className="text-lg font-bold text-slate-900">{analysis.items.length}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500">Valor Total</span>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-rose-200">
          <CardHeader className="pb-3 border-b border-rose-100 bg-rose-50/50">
            <CardTitle className="text-base flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-4 w-4" /> 3. Riscos Mapeados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {analysis.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0',
                    severityConfig[risk.severity],
                  )}
                >
                  {risk.category}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">{risk.description}</p>
                  <span className="text-xs text-blue-500">{risk.source}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-primary text-primary-foreground border-primary">
          <CardHeader className="pb-3 border-b border-primary/20">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <Lightbulb className="h-4 w-4" /> 4. Recomendações Práticas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{analysis.recommendations}</p>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-300 uppercase font-bold mb-2">Cronograma Reverso</p>
              <div className="space-y-1.5">
                {[
                  'Revisão Jurídica — 05/08',
                  'Fechamento de Preços — 10/08',
                  'Upload de Propostas — 13/08',
                  'Sessão Pública — 01/08',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
