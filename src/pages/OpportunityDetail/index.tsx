import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import useMainStore from '@/stores/main'
import { ExecutiveTab } from './ExecutiveTab'
import { ItemsTab } from './ItemsTab'
import { DeepAnalysisTab } from './DeepAnalysisTab'
import { DecisionGateTab } from './DecisionGateTab'
import { cn } from '@/lib/utils'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { opportunities } = useMainStore()
  const opp = opportunities.find((o) => o.id === id)

  if (!opp || !opp.analysis) {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
        <div className="p-12 text-center border rounded-xl bg-white">
          Oportunidade não encontrada.
        </div>
      </div>
    )
  }

  const { analysis } = opp

  const tabConfig = [
    { value: 'executive', label: 'Parecer Executivo' },
    { value: 'items', label: 'Itens do Edital' },
    { value: 'deep', label: 'Riscos & Plano (Deep)' },
    { value: 'gate', label: 'Portão de Decisão' },
  ]

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
              {analysis.score}
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
                {analysis.valores_prazos.data_abertura_propostas?.valor}
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

      <Tabs defaultValue="executive" className="w-full">
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
        <TabsContent value="gate" className="animate-fade-in-up outline-none mt-6">
          <DecisionGateTab questions={opp.decisionGate} oppId={opp.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
