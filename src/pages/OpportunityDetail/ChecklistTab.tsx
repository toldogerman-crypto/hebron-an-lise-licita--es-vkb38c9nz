import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ChecklistTab() {
  const documents = [
    {
      name: 'Balanço Patrimonial atualizado',
      category: 'Qualificação Econômica',
      mandatory: true,
      status: 'ok',
    },
    {
      name: 'Certidão Negativa Trabalhista (CNDT)',
      category: 'Habilitação Jurídica',
      mandatory: true,
      status: 'ok',
    },
    {
      name: 'Atestados de Capacidade Técnica (mín 2)',
      category: 'Qualificação Técnica',
      mandatory: true,
      status: 'missing',
    },
    {
      name: 'Declaração de Sustentabilidade',
      category: 'Declarações',
      mandatory: false,
      status: 'pending',
    },
  ]

  return (
    <div className="mt-6 border rounded-xl overflow-hidden shadow-sm bg-white">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium text-slate-700">Documento Exigido</th>
            <th className="px-6 py-4 font-medium text-slate-700">Categoria</th>
            <th className="px-6 py-4 font-medium text-slate-700 text-center">Obrigatório?</th>
            <th className="px-6 py-4 font-medium text-slate-700 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((doc, i) => (
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
                  {doc.status === 'ok' && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" title="Localizado" />
                  )}
                  {doc.status === 'missing' && (
                    <XCircle className="h-5 w-5 text-rose-500" title="Faltante" />
                  )}
                  {doc.status === 'pending' && (
                    <Clock className="h-5 w-5 text-amber-500" title="Em providência" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
