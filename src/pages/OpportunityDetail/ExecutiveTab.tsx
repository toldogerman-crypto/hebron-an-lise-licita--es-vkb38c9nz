import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, FileText, Lightbulb } from 'lucide-react'

export function ExecutiveTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" /> Resumo do Objeto
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            O edital visa a contratação de empresa especializada para prestação de serviços de
            consultoria em TI, englobando desenvolvimento de software, sustentação e análise de
            dados.
          </p>
          <p>
            <strong>Valor Estimado:</strong> R$ 4.500.000,00{' '}
            <span
              className="text-xs text-blue-500 bg-blue-50 px-1 rounded cursor-help"
              title="Fonte: Edital, pág 12"
            >
              [Fonte]
            </span>
          </p>
          <p>
            <strong>Prazo de Vigência:</strong> 24 meses, prorrogáveis.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Análise Técnica (Pontos Fortes)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-slate-600 leading-relaxed">
          <ul className="space-y-2 list-disc list-inside">
            <li>Acervo técnico exigido está dentro do portfólio da Hebron.</li>
            <li>Não há exigência de certificações internacionais exclusivas.</li>
            <li>Modelo de precificação por UST (Unidade de Serviço Técnico) favorável.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-rose-200">
        <CardHeader className="pb-3 border-b border-rose-100 bg-rose-50/50">
          <CardTitle className="text-base flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-4 w-4" /> Pontos de Atenção / Riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-slate-600 leading-relaxed">
          <ul className="space-y-2 list-disc list-inside">
            <li>Exigência de profissional sênior alocado presencialmente (custo elevado).</li>
            <li>Garantia contratual de 5% sobre o valor global exigida na assinatura.</li>
            <li>
              Penalidades severas para atrasos menores que 5 dias{' '}
              <span
                className="text-xs text-blue-500 bg-blue-50 px-1 rounded cursor-help"
                title="Fonte: Minuta do Contrato, Cláusula 9"
              >
                [Fonte]
              </span>
              .
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-primary text-primary-foreground border-primary">
        <CardHeader className="pb-3 border-b border-primary/20">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Lightbulb className="h-4 w-4" /> Recomendação Hebron
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-slate-300 leading-relaxed">
          <p className="text-white font-medium mb-2">Veredicto IA: ENTRAR</p>
          <p>
            Oportunidade altamente aderente (Score 92). Recomenda-se formar consórcio caso a
            garantia contratual impacte o fluxo de caixa, mas tecnicamente a Hebron possui 100% de
            capacidade comprovada.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
