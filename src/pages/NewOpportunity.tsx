import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  UploadCloud,
  File as FileIcon,
  X,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { AnalysisResult } from '@/lib/types'
import { mockAnalysisResponse } from '@/lib/mock-data'
import useMainStore from '@/stores/main'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

export default function NewOpportunity() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { addOpportunity } = useMainStore()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.length) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const processFiles = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setResult(null)

    try {
      // Simulate AI extraction logic (Hebron v6)
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (apiKey) {
        // Implementation for actual API call would go here
        await new Promise((r) => setTimeout(r, 2000))
        setResult(mockAnalysisResponse)
      } else {
        await new Promise((r) => setTimeout(r, 2500))
        setResult(mockAnalysisResponse)
      }
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Falha na análise. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddToPipeline = () => {
    if (!result) return
    const id = `opp-${Date.now()}`
    addOpportunity({
      id,
      title: result.objeto.valor,
      number: result.identificacao.numero_edital?.valor || 'S/N',
      organ: result.identificacao.orgao?.valor || 'Órgão não identificado',
      modality: result.identificacao.modalidade?.valor || 'Não identificada',
      status: 'interesse',
      verdict: result.veredicto,
      score: result.score,
      dateAdded: new Date().toISOString(),
      dueDate: result.valores_prazos.data_abertura_propostas?.valor || new Date().toISOString(),
      openingDate: result.valores_prazos.data_abertura_propostas?.valor || new Date().toISOString(),
      state: result.identificacao.municipio_uf?.valor?.split('/')[1] || '',
      city: result.identificacao.municipio_uf?.valor?.split('/')[0] || '',
      portal: result.identificacao.portal?.valor || '',
      responsible: 'Analista Sênior',
      observations: result.resumo_simples,
      radarSynced: false,
      analysis: result,
    })
    toast({
      title: 'Adicionado ao Radar!',
      description: 'Oportunidade salva na coluna "Interesse".',
    })
    navigate('/radar')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold font-display text-slate-900">
          Análise de Edital (Camada 1)
        </h1>
        <p className="text-slate-500">
          Faça o upload do edital em PDF ou Markdown. Nossa IA extrairá os dados e fará a triagem
          inicial baseada no perfil da Hebron.
        </p>
      </div>

      {!result && !isProcessing && (
        <Card className="border-2 border-dashed border-slate-300 shadow-none bg-white">
          <CardContent className="p-10">
            <div
              className="text-center transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-700 font-medium">
                Arraste os editais aqui ou clique para selecionar
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Aceita PDF e Markdown (.md, .txt) · Vários arquivos simultâneos
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.md,.markdown,.txt"
                className="hidden"
                onChange={(e) =>
                  e.target.files && setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
                }
              />
            </div>

            {files.length > 0 && (
              <div className="mt-8 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Arquivos ({files.length})
                  </span>
                </div>
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                      <X className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={processFiles}
                  className="w-full mt-4 bg-[#2563EB] hover:bg-blue-700 text-white gap-2 font-display"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Analisar Fila de Editais
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card className="border-slate-200 shadow-sm py-16 text-center">
          <CardContent className="space-y-6">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#2563EB] rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="h-8 w-8 text-[#2563EB]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Analisando edital com IA (Hebron v6)...
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">
                Extraindo requisitos, mapeando CNAEs e calculando o score inicial. Isso pode levar
                alguns minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !isProcessing && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div
              className={cn(
                'p-4 flex items-center gap-4',
                result.veredicto === 'ENTRAR'
                  ? 'bg-[#ECFDF5] border-b border-[#A7F3D0]'
                  : result.veredicto === 'ANALISAR MAIS'
                    ? 'bg-[#FFFBEB] border-b border-[#FDE68A]'
                    : 'bg-[#FEF2F2] border-b border-[#FECACA]',
              )}
            >
              <div className="flex-1">
                <StatusBadge verdict={result.veredicto} />
                <h3 className="text-lg font-bold font-display text-slate-900 mt-2">
                  {result.identificacao.numero_edital?.valor} - {result.identificacao.orgao?.valor}
                </h3>
              </div>
              <div className="text-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-500 uppercase font-display">
                  Score
                </span>
                <span
                  className={cn(
                    'block text-3xl font-black font-display leading-none',
                    result.veredicto === 'ENTRAR' ? 'text-[#065F46]' : 'text-[#7F1D1D]',
                  )}
                >
                  {result.score}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {result.trava && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                  <p className="text-sm text-[#7F1D1D]">
                    <strong>Trava Eliminatória:</strong> {result.trava}
                  </p>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                {result.resumo_simples}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Objeto:</span>
                  <p className="font-medium text-slate-900">{result.objeto.valor}</p>
                </div>
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Abertura:</span>
                  <p className="font-medium text-slate-900">
                    {result.valores_prazos.data_abertura_propostas?.valor}
                  </p>
                </div>
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Valor Estimado:</span>
                  <p className="font-medium text-slate-900">
                    {result.valores_prazos.valor_estimado?.valor}
                  </p>
                </div>
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Compatibilidade CNAE:</span>
                  <p className="font-medium text-slate-900">
                    {result.compatibilidade.cnae_compativel ? '✓ Sim' : '✗ Não'} (
                    {result.compatibilidade.cnae_match})
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddToPipeline}
                className="w-full bg-[#1F2937] hover:bg-slate-800 text-white font-display text-base h-12 gap-2 mt-4"
              >
                <FileText className="w-5 h-5" /> Enviar ao Pipeline (Meus Processos){' '}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setResult(null)}
                className="w-full text-slate-500"
              >
                Analisar outro edital
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
