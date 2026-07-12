import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, BrainCircuit, Loader2, AlertCircle, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { useRealtime } from '@/hooks/use-realtime'
import useMainStore from '@/stores/main'
import { analyzeCamada1 } from '@/services/oportunidades'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { ExecutiveTab } from './ExecutiveTab'
import { ItemsTab } from './ItemsTab'
import { DeepAnalysisTab } from './DeepAnalysisTab'
import { DecisionGateTab } from './DecisionGateTab'
import { ChecklistTab } from './ChecklistTab'
import { cn } from '@/lib/utils'

export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opportunities, role, refreshOpportunities, deleteOpportunity } = useMainStore()
  const opp = opportunities.find((o) => o.id === id)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

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

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteOpportunity(id)
      navigate('/')
    } catch (err) {
      console.error('Failed to delete opportunity:', err)
      setIsDeleting(false)
    }
  }

  const handleRetryAnalysis = async () => {
    if (!id) return
    setIsRetrying(true)
    try {
      await analyzeCamada1(id)
    } catch {
      setIsRetrying(false)
    }
  }

  if (opp.status === 'em_analise') {
    return (
      <div className="space-y-6 pb-20">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500">
          <Link to="/radar">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Pipeline
          </Link>
        </Button>
        <Card className="max-w-2xl mx-auto p-8 shadow-md border-blue-100">
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              <BrainCircuit className="h-16 w-16 text-[#2563EB]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2563EB]"></span>
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Sistema trabalhando...
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              A IA está processando o documento e extraindo os dados do edital. Esta página será
              atualizada automaticamente quando a análise for concluída.
            </p>
            <div className="max-w-md mx-auto space-y-2 pt-4">
              <Progress value={66} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span className="text-[#2563EB] font-medium">Lendo edital...</span>
                <span className="text-[#2563EB] font-medium">Extraindo dados...</span>
                <span>Calculando score...</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {['Município/UF', 'Modalidade', 'Data de Abertura', 'Órgão', 'Nº do Edital'].map(
                (field, i) => (
                  <span
                    key={field}
                    className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {field}
                  </span>
                ),
              )}
            </div>
            <div className="border rounded-xl p-4 bg-slate-50 space-y-3 text-left">
              <Skeleton className="h-5 w-3/4" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </Card>
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
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              onClick={handleRetryAnalysis}
              disabled={isRetrying}
              className="gap-2 bg-[#2563EB] hover:bg-blue-700"
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              {isRetrying ? 'Reanalisando...' : 'Reanalisar'}
            </Button>
            <Button onClick={() => refreshOpportunities()} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Atualizar
            </Button>
            <Button asChild variant="outline" className="gap-2">
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
        <Button
          variant="ghost"
          size="sm"
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Excluir
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={(o) => !o && setDeleteDialogOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir oportunidade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Todos os dados e documentos serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
