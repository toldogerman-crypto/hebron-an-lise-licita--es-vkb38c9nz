import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BrainCircuit, TrendingUp, Calendar, AlertCircle } from 'lucide-react'
import type { Opportunity } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { analyzeDeep } from '@/services/oportunidades'
import useMainStore from '@/stores/main'

export function DeepAnalysisTab({ opp }: { opp: Opportunity }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { updateOpportunity, role, refreshOpportunities } = useMainStore()
  const { toast } = useToast()

  const isLegal = role === 'legal'
  const isFinancial = role === 'financial'

  const handleDeepAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await Promise.all([analyzeDeep(opp.id, 'camada23'), analyzeDeep(opp.id, 'camada45')])
      await refreshOpportunities()
    } catch (err) {
      toast({
        title: 'Erro',
        description: err instanceof Error ? err.message : 'Falha na análise profunda.',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!opp.deepRisco || !opp.deepMargem) {
    return (
      <div className="text-center py-16 border rounded-xl bg-slate-50 border-dashed border-slate-300">
        <BrainCircuit className="w-12 h-12 text-[#2563EB]/50 mx-auto mb-4" />
        <h3 className="text-lg font-bold font-display text-slate-800">
          Análise Profunda (Camadas 2 a 5)
        </h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm mt-2">
          A IA irá mapear os riscos específicos do edital (Financeiro, Documental, Operacional),
          pesquisar estimativas de mercado e montar um plano de ação tático.
        </p>
        <Button
          onClick={handleDeepAnalyze}
          disabled={isAnalyzing}
          className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
        >
          {isAnalyzing ? (
            <BrainCircuit className="w-4 h-4 animate-spin" />
          ) : (
            <BrainCircuit className="w-4 h-4" />
          )}
          {isAnalyzing ? 'Pesquisando na web e classificando...' : 'Rodar Análise Profunda'}
        </Button>
      </div>
    )
  }

  const deepRisco = opp.deepRisco
  const deepMargem = opp.deepMargem

  const riscoFinanceiro = deepRisco?.risco_financeiro ?? { nota: 0, fatores: [] }
  const riscoDocumental = deepRisco?.risco_documental ?? { nota: 0, fatores: [] }
  const riscoOperacional = deepRisco?.risco_operacional ?? { nota: 0, fatores: [] }

  return (
    <div className="space-y-6">
      <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#0D6E3F] text-white flex items-center justify-center text-2xl font-bold font-display shrink-0">
          {deepRisco?.classificacao ?? '?'}
        </div>
        <div className="text-sm text-slate-700 font-medium leading-relaxed">
          {deepRisco?.justificativa_classe ?? 'Sem justificativa disponível.'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isFinancial && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              Matriz de Riscos (Camadas 2 e 3)
            </h3>

            {[
              { label: 'Risco Financeiro', data: riscoFinanceiro },
              { label: 'Risco Documental', data: riscoDocumental },
              { label: 'Risco Operacional', data: riscoOperacional },
            ].map((r, i) => (
              <div key={i} className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700 text-sm">{r.label}</span>
                  <span
                    className={`font-bold text-sm ${r.data.nota >= 7 ? 'text-[#8B1A1A]' : r.data.nota >= 4 ? 'text-[#B8860B]' : 'text-[#0D6E3F]'}`}
                  >
                    {r.data.nota}/10
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                  <div
                    className={`h-full ${r.data.nota >= 7 ? 'bg-[#8B1A1A]' : r.data.nota >= 4 ? 'bg-[#B8860B]' : 'bg-[#0D6E3F]'}`}
                    style={{ width: `${r.data.nota * 10}%` }}
                  />
                </div>
                <ul className="space-y-1.5">
                  {(r.data.fatores ?? []).map((f, j) => (
                    <li key={j} className="text-xs text-slate-600 leading-snug flex gap-1.5">
                      <span className="text-slate-300">•</span>
                      <span>
                        {f?.fator ?? ''}
                        {f?.fonte && (
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1 rounded ml-1 inline-block">
                            {f.fonte}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {deepRisco?.multas_penalidades && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase text-[#7F1D1D] mb-1">
                  Multas Previstas
                </h4>
                <p className="text-sm text-[#991B1B]">
                  {deepRisco.multas_penalidades.valor ?? 'N/A'}
                </p>
              </div>
            )}
            {!isLegal && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">
                  Capital de Giro Estimado
                </h4>
                <p className="text-sm text-slate-700">
                  {deepRisco?.capital_giro_estimado ?? 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}

        {!isLegal && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              Pesquisa e Margem (Camadas 4 e 5)
            </h3>

            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#065F46] font-bold font-display">
                <TrendingUp className="w-5 h-5" /> Margem Bruta:{' '}
                {deepMargem?.margem?.margem_bruta_estimada ?? 'N/A'}
              </div>
              <p className="text-sm text-slate-700 mb-3">
                <strong>Custo de mercado base:</strong>{' '}
                {deepMargem?.margem?.custo_mercado_estimado ?? 'N/A'}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {deepMargem?.margem?.avaliacao ?? ''}
              </p>
              {deepMargem?.margem?.fontes_pesquisa && (
                <div className="text-[11px] text-slate-500 bg-white/50 p-2 rounded border border-[#A7F3D0]/50 mb-3">
                  Fontes: {deepMargem.margem.fontes_pesquisa.join(' · ')}
                </div>
              )}
              {deepMargem?.margem?.alerta && (
                <div className="text-xs text-[#92400E] bg-[#FFFBEB] p-2.5 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {deepMargem.margem.alerta}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Primeiro Passo
                </h4>
                <p className="text-sm bg-[#7C3AED] text-white p-3 rounded-lg font-medium shadow-sm">
                  {deepMargem?.plano?.primeiro_passo ?? 'N/A'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Cronograma
                </h4>
                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                  {(deepMargem?.plano?.cronograma ?? []).map((c, i) => (
                    <div key={i} className="flex items-center gap-3 relative">
                      <div className="w-[85px] shrink-0 text-right text-xs font-bold text-[#7C3AED]">
                        {c?.prazo ?? ''}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 z-10 shadow-[0_0_0_4px_white]" />
                      <div className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded flex-1">
                        {c?.acao ?? ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!isFinancial && (
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Checklist Documental
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(deepMargem?.plano?.documentos_checklist ?? []).map((d, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        ☐ {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
