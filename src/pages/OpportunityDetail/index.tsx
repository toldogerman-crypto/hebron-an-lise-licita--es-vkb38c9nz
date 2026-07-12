import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BrainCircuit, Loader2, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { useRealtime } from '@/hooks/use-realtime'
import useMainStore from '@/stores/main'
import { ExecutiveTab } from './ExecutiveTab'
import { ItemsTab } from './ItemsTab'
import { DeepAnalysisTab } from './DeepAnalysisTab'
import { DecisionGateTab } from './DecisionGateTab'
import { ChecklistTab } from './ChecklistTab'
import { cn } from '@/lib/utils'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { opportunities, role, refreshOpportunities } = useMainStore()
  const opp = opportunities.find((o) => o.id === id)

  useRealtime<Record<string, any>>('oportunidades', (e) => {
    if (e.record.id === id) {
      refreshOpportunities()
    }
  })

  useRealtime<Record<string, any>>('analises', (e) => {
    const oppId = e.record?.oportunidade_id
    if (oppId === id) {
      refreshOpportunities()
    }
  })

  if (!opp) {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
        <div className="p-12 text-center border rounded-xl bg-white">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Carregando oportunidade...</p>
        </div>
      </div>
    )
  }

  if (opp.status === 'em_analise') {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Pipeline
          </Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-8 pt-8">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-[#2563EB] animate-spin mb-4" />
            <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
              Analisando edital...
            </h2>
            <p className="text-sm text-slate-500">
              A IA está processando o documento e extraindo os dados. Aguarde.
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={66} className="h-2" />
            <div className="flex justify-between text-xs text-slate-400">
              <span className="text-[#2563EB] font-medium">Lendo edital...</span>
              <span className="text-[#2563EB] font-medium">Extraindo dados...</span>
              <span>Calculando score...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (opp.status === 'falha_analise') {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Pipeline
          </Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-6 pt-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
            <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Falha na Análise</h2>
            <p className="text-sm text-slate-500">
              {opp.observations || 'Ocorreu um erro durante o processamento do edital.'}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={() => refreshOpportunities()} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Atualizar
            </Button>
            <Button asChild className="gap-2 bg-[#2563EB] hover:bg-blue-700">
              <Link to="/nova-oportunidade">Nova Análise</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!opp.analysis) {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Pipeline
          </Link>
        </Button>
        <div className="p-12 text-center border rounded-xl bg-white">
          <p className="text-slate-500">
            Esta oportunidade ainda não possui análise. Crie uma nova análise na página de Nova
            Oportunidade.
          </p>
        </div>
      </div>
    )
  }

  const { analysis } = opp

  const isLegal = role === 'legal'
  const isFinancial = role === 'financial'

  const tabConfig = [
    { value: 'executive', label: 'Parecer Executivo', hide: isFinancial },
    { value: 'items', label: 'Itens do Edital', hide: false },
    { value: 'deep', label: 'Riscos & Plano', hide: false },
    { value: 'gate', label: 'Portão de Decisão', hide: isLegal || isFinancial },
    { value: 'checklist', label: 'Checklist', hide: false },
  ].filter((t) => !t.hide)

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Pipeline
          </Link>
        </Button>
      </div>

      <div
        className={cn(
          'p-6 rounded-xl border shadow-sm relative overflow-hidden',
          analysis.veredicto === 'ENTRAR'
            ? 'bg-[#F0FDF4] border-[#A7F3D0]'
            : analysis.veredicto === 'ANALISAR MAIS'
              ? 'bg-[#FFFBEB] border-[#FDE68A]'
              : 'bg-[#FEF2F2] border-[#FECACA]',
        )}
      >
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-3 z-10">
          <StatusBadge verdict={analysis.veredicto} className="text-sm px-4 py-1" />
          <div className="bg-white border border-slate-100 rounded-lg p-2 text-center shadow-sm min-w-[100px]">
            <span className="block text-[10px] uppercase text-slate-500 font-bold font-display">
              Hebron Score
            </span>
            <span
              className={cn(
                'block text-2xl font-black font-display leading-none',
                analysis.veredicto === 'ENTRAR' ? 'text-[#065F46]' : 'text-[#7F1D1D]',
              )}
            >
              {analysis.score ?? 0}
            </span>
          </div>
        </div>

        <div className="max-w-3xl pr-32 relative z-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-sm font-bold font-display text-slate-700 bg-white/60 px-2 py-1 rounded border border-black/5">
              {opp.number}
            </span>
            <span className="text-sm font-medium text-slate-700">{opp.organ}</span>
            <span className="text-sm text-slate-600">
              • {opp.city}/{opp.state}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mb-4 leading-tight">
            {opp.title}
          </h1>
          <div className="flex items-center gap-6 text-sm flex-wrap text-slate-700">
            <div>
              <span className="opacity-70">Abertura:</span>{' '}
              <span className="font-medium">
                {analysis.valores_prazos?.data_abertura_propostas?.valor ||
                  opp.openingDate ||
                  'N/A'}
              </span>
            </div>
            {opp.portal && (
              <div>
                <span className="opacity-70">Portal:</span>{' '}
                <span className="font-medium">{opp.portal}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLegal && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm mb-4 font-medium flex items-center gap-2">
          Visão Jurídica Ativa: Foco em Cláusulas Restritivas, Impugnações e Riscos Documentais.
        </div>
      )}
      {isFinancial && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm mb-4 font-medium flex items-center gap-2">
          Visão Financeira Ativa: Foco em Margem de Lucro, Preço Estimado e Risco de Capital.
        </div>
      )}

      <Tabs defaultValue={tabConfig[0].value} className="w-full">
        <div className="overflow-x-auto pb-2 border-b border-slate-200">
          <TabsList className="bg-transparent p-0 justify-start w-max border-0 h-auto">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] rounded-none px-4 pb-3 pt-2 font-semibold font-display text-sm whitespace-nowrap text-slate-500"
              >
                {tab.value === 'deep' && <BrainCircuit className="w-4 h-4 mr-2 inline" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="executive" className="animate-fade-in-up outline-none mt-6">
          <ExecutiveTab analysis={analysis} />
        </TabsContent>
        <TabsContent value="items" className="animate-fade-in-up outline-none mt-6">
          <ItemsTab analysis={analysis} />
        </TabsContent>
        <TabsContent value="deep" className="animate-fade-in-up outline-none mt-6">
          <DeepAnalysisTab opp={opp} />
        </TabsContent>
        {!isLegal && !isFinancial && (
          <TabsContent value="gate" className="animate-fade-in-up outline-none mt-6">
            <DecisionGateTab questions={opp.decisionGate} oppId={opp.id} />
          </TabsContent>
        )}
        <TabsContent value="checklist" className="animate-fade-in-up outline-none mt-6">
          <ChecklistTab opp={opp} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
