import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Share, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { mockOpportunities } from '@/lib/mock-data'
import { ExecutiveTab } from './ExecutiveTab'
import { ChecklistTab } from './ChecklistTab'
import { TimelineTab } from './TimelineTab'

export default function OpportunityDetail() {
  const { id } = useParams()
  // Mock finding the opportunity or using the first one
  const opp = mockOpportunities.find((o) => o.id === id) || mockOpportunities[1]

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
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

      {/* Header Summary */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-3 z-10">
          <StatusBadge verdict={opp.verdict} className="text-sm px-4 py-1" />
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center shadow-sm">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">
              Hebron Score
            </span>
            <span className="block text-2xl font-black text-primary leading-none">
              {opp.score}%
            </span>
          </div>
        </div>

        <div className="max-w-3xl pr-32 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {opp.number}
            </span>
            <span className="text-sm text-slate-500">{opp.organ}</span>
            <span className="text-sm text-slate-500">• {opp.state}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {opp.title}
          </h1>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-500">Modalidade:</span>{' '}
              <span className="font-medium text-slate-900">{opp.modality}</span>
            </div>
            <div>
              <span className="text-slate-500">Abertura:</span>{' '}
              <span className="font-medium text-rose-600">15 Ago 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="executive" className="w-full">
        <div className="overflow-x-auto pb-2 border-b border-slate-200">
          <TabsList className="bg-transparent p-0 justify-start w-max border-0">
            <TabsTrigger
              value="executive"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 pb-3 pt-2 font-medium"
            >
              Parecer Executivo
            </TabsTrigger>
            <TabsTrigger
              value="checklist"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 pb-3 pt-2 font-medium"
            >
              Checklist Documental
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 pb-3 pt-2 font-medium"
            >
              Cronograma
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 pb-3 pt-2 font-medium"
            >
              Arquivos (3)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="executive" className="animate-fade-in-up outline-none">
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary gap-2">
              <Edit className="h-4 w-4" /> Editar Parecer IA
            </Button>
          </div>
          <ExecutiveTab />
        </TabsContent>

        <TabsContent value="checklist" className="animate-fade-in-up outline-none">
          <ChecklistTab />
        </TabsContent>

        <TabsContent value="timeline" className="animate-fade-in-up outline-none">
          <TimelineTab />
        </TabsContent>

        <TabsContent value="docs" className="animate-fade-in-up outline-none mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Documentos da Licitação</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-rose-500 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      edital_001_2026_anexo{i}.pdf
                    </p>
                    <p className="text-xs text-slate-500">2.4 MB</p>
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
