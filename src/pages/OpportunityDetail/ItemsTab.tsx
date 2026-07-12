import type { AnalysisResult } from '@/lib/types'

export function ItemsTab({ analysis }: { analysis: AnalysisResult }) {
  const items = analysis?.itens ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900">Itens e Quantidades</h3>
          <p className="text-sm text-slate-500">
            {analysis?.total_itens ?? `${items.length} itens`}
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-[#F9FAFB] border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Item</th>
              <th className="px-4 py-3 font-semibold text-slate-700 text-right">Qtde</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Un.</th>
              <th className="px-4 py-3 font-semibold text-slate-700 text-right">Valor Unit.</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Fonte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{item?.item ?? ''}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                  {item?.quantidade ?? ''}
                </td>
                <td className="px-4 py-3 text-slate-500">{item?.unidade ?? ''}</td>
                <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap">
                  {item?.valor_unitario_estimado ?? ''}
                </td>
                <td className="px-4 py-3">
                  {item?.fonte && (
                    <span className="text-[11px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {item.fonte}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum item localizado ou erro na extração.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {analysis?.glossario && analysis.glossario.length > 0 && (
        <div className="bg-[#F9FAFB] border border-slate-200 rounded-xl p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Glossário de Termos do Edital
          </h4>
          <div className="space-y-3">
            {analysis.glossario.map((g, i) => (
              <div key={i} className="text-sm">
                <strong className="text-slate-900">{g?.termo ?? ''}: </strong>
                <span className="text-slate-600">{g?.explicacao ?? ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
