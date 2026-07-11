import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Share, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { UrgencySemaphore } from '@/components/UrgencySemaphore'
import useMainStore from '@/stores/main'
import { ExecutiveTab } from './ExecutiveTab'
import { ChecklistTab } from './ChecklistTab'
import { TimelineTab } from './TimelineTab'
import { ItemsTab } from './ItemsTab'
import { DecisionGateTab } from './DecisionGateTab'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { opportunities, analysis: analysisMap, decisionGates } = useMainStore()
  const opp = opportunities.find((o) => o.id === id)

  if (!opp) {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Radar
          </Link>
        </Button>
        <div className="p-12 flex flex-col items-center justify-center text-center border border-slate-200 rounded-xl bg-white">
          <FileText className="h-12 w-12 text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-700">Oportunidade não encontrada</h2>
          <p className="text-sm text-slate-500 mt-1">
            Esta oportunidade pode ter sido excluída ou não existe.
          </p>
          <Button asChild className="mt-4">
            <Link to="/radar">Voltar ao Radar</Link>
          </Button>
        </div>
      </div>
    )
  }

  const analysis = analysisMap[opp.id]
  const decisionGate = decisionGates[opp.id]

  const tabConfig = [
    { value: 'executive', label: 'Parecer Executivo' },
    { value: 'items', label: 'Itens & Margem' },
    { value: 'checklist', label: 'Checklist' },
    { value: 'gate', label: 'Portão de Decisão' },
    { value: 'timeline', label: 'Cronograma' },
    { value: 'docs', label: 'Arquivos (3)' },
  ]

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Radar
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="h-4 w-4" /> Compartilhar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-3 z-10">
          <StatusBadge verdict={opp.verdict} className="text-sm px-4 py-1" />
          {analysis && (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center shadow-sm">
                <span className="block text-[10px] uppercase text-slate-500 font-bold">
                  Hebron Score
                </span>
                <span className="block text-2xl font-black text-primary leading-none">
                  {analysis.scoreTotal}%
                </span>
              </div>
              <UrgencySemaphore openingDate={opp.openingDate} />
            </>
          )}
          {analysis && analysis.eliminationLocks.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 max-w-[200px]">
              <span className="block text-[10px] uppercase text-rose-600 font-bold mb-1">
                Bloqueios
              </span>
              {analysis.eliminationLocks.map((lock, i) => (
                <span key={i} className="block text-xs text-rose-700">
                  {lock}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl pr-32 relative z-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {opp.number}
            </span>
            <span className="text-sm text-slate-500">{opp.organ}</span>
            <span className="text-sm text-slate-500">
              • {opp.city}/{opp.state}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {opp.title}
          </h1>
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div>
              <span className="text-slate-500">Modalidade:</span>{' '}
              <span className="font-medium text-slate-900">{opp.modality}</span>
            </div>
            <div>
              <span className="text-slate-500">Responsável:</span>{' '}
              <span className="font-medium text-slate-900">{opp.responsible}</span>
            </div>
            {opp.portal && (
              <div>
                <a
                  href={opp.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver Portal ↗
                </a>
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
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3 pt-2 font-medium text-sm whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="executive" className="animate-fade-in-up outline-none">
          <ExecutiveTab analysis={analysis} />
        </TabsContent>
        <TabsContent value="items" className="animate-fade-in-up outline-none">
          <ItemsTab analysis={analysis} />
        </TabsContent>
        <TabsContent value="checklist" className="animate-fade-in-up outline-none">
          <ChecklistTab analysis={analysis} />
        </TabsContent>
        <TabsContent value="gate" className="animate-fade-in-up outline-none">
          <DecisionGateTab questions={decisionGate} oppId={opp.id} />
        </TabsContent>
        <TabsContent value="timeline" className="animate-fade-in-up outline-none">
          <TimelineTab />
        </TabsContent>
        <TabsContent value="docs" className="animate-fade-in-up outline-none mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Documentos da Licitação</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Edital Completo', 'Termo de Referência', 'Minuta do Contrato'].map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-rose-500 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc}</p>
                    <p className="text-xs text-slate-500">{['2.4 MB', '1.1 MB', '0.8 MB'][i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
