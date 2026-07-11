import { CheckCircle2, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisResult } from '@/lib/types'

interface ChecklistTabProps {
  analysis?: AnalysisResult
}

export function ChecklistTab({ analysis }: ChecklistTabProps) {
  if (!analysis || analysis.checklist.length === 0) {
    return <div className="mt-6 text-center py-12 text-slate-500">Checklist não disponível.</div>
  }

  const docs = analysis.checklist
  const okCount = docs.filter((d) => d.status === 'ok').length
  const missingCount = docs.filter((d) => d.status === 'missing').length
  const pendingCount = docs.filter((d) => d.status === 'pending').length
  const missingMandatory = docs.filter((d) => d.status === 'missing' && d.mandatory).length

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{okCount}</p>
              <p className="text-xs text-slate-500">Documentos OK</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{missingCount}</p>
              <p className="text-xs text-slate-500">Faltantes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              <p className="text-xs text-slate-500">Em Providência</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {missingMandatory > 0 && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">
            {missingMandatory} documento(s) obrigatório(s) faltante(s). Isso pode impedir a
            participação.
          </p>
        </div>
      )}

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-700">Documento</th>
              <th className="px-6 py-4 font-medium text-slate-700">Categoria</th>
              <th className="px-6 py-4 font-medium text-slate-700 text-center">Obrigatório</th>
              <th className="px-6 py-4 font-medium text-slate-700 text-center">Status</th>
              <th className="px-6 py-4 font-medium text-slate-700">Fonte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{doc.name}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="bg-slate-100">
                    {doc.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  {doc.mandatory ? <span className="font-bold text-slate-700">Sim</span> : 'Não'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {doc.status === 'ok' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    {doc.status === 'missing' && <XCircle className="h-5 w-5 text-rose-500" />}
                    {doc.status === 'pending' && <Clock className="h-5 w-5 text-amber-500" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-blue-500 bg-blue-50 px-1 rounded">
                    {doc.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="shadow-sm border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Análise de Margem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Margem Estimada</span>
            <span
              className={`text-2xl font-bold ${analysis.estimatedMargin >= 15 ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {analysis.estimatedMargin}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Margem Mínima (Hebron)</span>
            <span className="text-sm font-medium text-slate-900">15%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${analysis.estimatedMargin >= 15 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(analysis.estimatedMargin * 2, 100)}%` }}
            />
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Estimativa baseada em pesquisa pública — não substitui cotação formal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
