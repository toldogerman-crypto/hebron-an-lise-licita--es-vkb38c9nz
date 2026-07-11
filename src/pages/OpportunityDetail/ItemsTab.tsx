import { Download, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ItemsTabProps {
  analysis?: AnalysisResult
}

export function ItemsTab({ analysis }: ItemsTabProps) {
  const { toast } = useToast()

  if (!analysis || analysis.items.length === 0) {
    return (
      <div className="mt-6 text-center py-12 text-slate-500">Nenhum item extraído do edital.</div>
    )
  }

  const items = analysis.items
  const showAll = items.length <= 15
  const displayItems = showAll ? items : items.slice(0, 15)
  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue * item.quantity, 0)

  const handleExport = () => {
    const headers = [
      'Item',
      'Quantidade',
      'Unidade',
      'Valor Unit. Estimado',
      'Valor Total Estimado',
      'Fonte',
    ]
    const rows = items.map((item, i) => [
      `${i + 1}. ${item.name}`,
      String(item.quantity),
      item.unit,
      formatCurrency(item.estimatedValue),
      formatCurrency(item.estimatedValue * item.quantity),
      item.source,
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solicitacao_cotacao_hebron.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: 'Cotação Exportada',
      description: 'Arquivo CSV gerado para envio aos fornecedores.',
    })
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Itens Extraídos do Edital</h3>
          <p className="text-sm text-slate-500">
            {items.length} {items.length === 1 ? 'item' : 'itens'} encontrados
            {!showAll && ' (exibindo top 15)'}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar Cotação
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-700">#</th>
              <th className="px-4 py-3 font-medium text-slate-700">Item</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-center">Qtd</th>
              <th className="px-4 py-3 font-medium text-slate-700">Unidade</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-right">Valor Unit.</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-right">Valor Total</th>
              <th className="px-4 py-3 font-medium text-slate-700">Fonte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayItems.map((item, i) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                <td className="px-4 py-3 text-center">{item.quantity.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3">{item.unit}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(item.estimatedValue)}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(item.estimatedValue * item.quantity)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-blue-500 bg-blue-50 px-1 rounded">
                    {item.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-200">
            <tr>
              <td colSpan={5} className="px-4 py-3 font-bold text-slate-900 text-right">
                Valor Total Estimado:
              </td>
              <td className="px-4 py-3 text-right font-bold text-primary text-base">
                {formatCurrency(totalValue)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Card className="shadow-sm border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
            <TrendingUp className="h-4 w-4" /> Estimativa de Margem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              Margem Estimada:{' '}
              <strong
                className={analysis.estimatedMargin >= 15 ? 'text-emerald-600' : 'text-rose-600'}
              >
                {analysis.estimatedMargin}%
              </strong>
            </span>
            <span className="text-sm text-slate-600">Mínimo Hebron: 15%</span>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Estimativa baseada em pesquisa pública — não substitui cotação formal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
