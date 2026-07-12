import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Info, MapPin, Zap } from 'lucide-react'
import type { AnalysisResult } from '@/lib/types'

function InfoRow({ label, value, source }: { label: string; value?: string; source?: string }) {
  if (!value || value === 'NÃO LOCALIZADO NO EDITAL') return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-slate-100 last:border-0 gap-1">
      <span className="text-sm font-medium text-slate-600 sm:w-1/3 shrink-0">{label}</span>
      <div className="flex flex-col sm:items-end flex-1 sm:text-right">
        <span className="text-sm font-semibold text-slate-900">{value}</span>
        {source && (
          <span className="text-[10px] text-blue-500 bg-blue-50 px-1 rounded w-max mt-1">
            {source}
          </span>
        )}
      </div>
    </div>
  )
}

export function ExecutiveTab({ analysis }: { analysis: AnalysisResult }) {
  const vp = analysis?.valores_prazos ?? {}
  const compat = analysis?.compatibilidade
  const fit = analysis?.fit_estrategico
  const benef = analysis?.beneficio_epp
  const exig = analysis?.exigencias as
    | Record<string, { valor: string; fonte: string } | undefined>
    | undefined
  const local = analysis?.local_entrega
  const pontosPositivos = analysis?.pontos_positivos ?? []
  const riscos = analysis?.riscos ?? []

  return (
    <div className="space-y-6">
      {analysis?.trava && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 rounded-xl flex gap-3">
          <AlertTriangle className="text-[#B91C1C] shrink-0" />
          <div>
            <h4 className="font-bold text-[#7F1D1D]">Trava Eliminatória Ativada</h4>
            <p className="text-sm text-[#991B1B] mt-1">{analysis.trava}</p>
          </div>
        </div>
      )}

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 text-slate-700 text-sm leading-relaxed">
          {analysis?.resumo_simples ?? 'Análise não disponível.'}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-display text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Info className="w-4 h-4 text-slate-500" /> Valores e Prazos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 px-6">
            <InfoRow
              label="Valor Estimado"
              value={vp?.valor_estimado?.valor}
              source={vp?.valor_estimado?.fonte}
            />
            <InfoRow
              label="Abertura das Propostas"
              value={vp?.data_abertura_propostas?.valor}
              source={vp?.data_abertura_propostas?.fonte}
            />
            <InfoRow
              label="Prazo de Execução"
              value={vp?.prazo_entrega_execucao?.valor}
              source={vp?.prazo_entrega_execucao?.fonte}
            />
            <InfoRow
              label="Prazo de Pagamento"
              value={vp?.prazo_pagamento?.valor}
              source={vp?.prazo_pagamento?.fonte}
            />
            <InfoRow
              label="Vigência Contratual"
              value={vp?.vigencia_contrato?.valor}
              source={vp?.vigencia_contrato?.fonte}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-display text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Zap className="w-4 h-4 text-slate-500" /> Compatibilidade Hebron
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 px-6">
            {compat && (
              <div className="py-3 border-b border-slate-100">
                <span
                  className={`text-sm font-bold ${compat.cnae_compativel ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {compat.cnae_compativel ? '✓ CNAE Compatível' : '✗ CNAE Incompatível'}
                </span>
                <p className="text-xs text-slate-500 mt-1">{compat.cnae_match ?? ''}</p>
              </div>
            )}
            <InfoRow label="Segmento" value={fit?.segmento} />
            <InfoRow label="Requer Estoque" value={fit?.opera_sem_estoque} />
            <InfoRow label="Benefício ME/EPP" value={benef?.valor} source={benef?.fonte} />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 md:col-span-2">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-display text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <MapPin className="w-4 h-4 text-slate-500" /> Exigências e Local
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 px-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
            <InfoRow
              label="Atestado Técnico"
              value={exig?.atestado_tecnico?.valor}
              source={exig?.atestado_tecnico?.fonte}
            />
            <InfoRow
              label="Garantia"
              value={exig?.garantia?.valor}
              source={exig?.garantia?.fonte}
            />
            <InfoRow label="Local de Entrega" value={local?.valor} source={local?.fonte} />
            <InfoRow
              label="Vistoria"
              value={exig?.vistoria?.valor}
              source={exig?.vistoria?.fonte}
            />
          </CardContent>
        </Card>
      </div>

      {(pontosPositivos.length > 0 || riscos.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pontosPositivos.length > 0 && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-display text-slate-800 uppercase tracking-wide">
                  Pontos Positivos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 px-6">
                <ul className="space-y-2">
                  {pontosPositivos.map((p, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {riscos.length > 0 && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-display text-slate-800 uppercase tracking-wide">
                  Riscos Identificados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 px-6">
                <ul className="space-y-2">
                  {riscos.map((r, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-rose-500 shrink-0">⚠</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {analysis?.recomendacao && (
        <div className="bg-[#1F2937] text-white p-6 rounded-xl shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Recomendação do Analista (Camada 1)
          </h4>
          <p className="text-sm leading-relaxed text-slate-200">{analysis.recomendacao}</p>
        </div>
      )}
    </div>
  )
}
