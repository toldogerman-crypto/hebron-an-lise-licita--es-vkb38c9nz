import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import useMainStore from '@/stores/main'
import { createOportunidade, updateOportunidade, analyzeCamada1 } from '@/services/oportunidades'
import { createDocumento } from '@/services/documentos'

const MODALITIES = [
  'Pregão Eletrônico',
  'Pregão Presencial',
  'Concorrência',
  'Tomada de Preços',
  'Convite',
  'Dispensa de Licitação',
  'Inexigibilidade',
  'Cotação Eletrônica',
  'Compra Direta',
]

const PROGRESS_MESSAGES = ['Lendo edital...', 'Extraindo dados...', 'Calculando score...']
const EXTRACTION_FIELDS = [
  'Município/UF',
  'Modalidade',
  'Data de Abertura',
  'Órgão',
  'Nº do Edital',
]

export default function NewOpportunity() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { refreshOpportunities } = useMainStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<'upload' | 'processing' | 'review' | 'error'>('upload')
  const [progressStep, setProgressStep] = useState(0)
  const [oppId, setOppId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    numero_edital: '',
    orgao: '',
    municipio_uf: '',
    modalidade: '',
    data_abertura: '',
    responsavel: user?.name || '',
    observations: '',
  })

  useRealtime<Record<string, any>>(
    'oportunidades',
    (e) => {
      if (!oppId || e.record.id !== oppId) return
      const status = e.record.status
      if (status === 'em_analise') {
        setProgressStep(0)
      } else if (status === 'aguardando_decisao') {
        const r = e.record
        setForm({
          titulo: r.titulo || '',
          numero_edital: r.numero_edital || '',
          orgao: r.orgao || '',
          municipio_uf: r.municipio_uf || '',
          modalidade: r.modalidade || '',
          data_abertura: r.data_abertura ? String(r.data_abertura).split(' ')[0] : '',
          responsavel: r.responsavel || user?.name || '',
          observations: r.observations || '',
        })
        setStage('review')
      } else if (status === 'falha_analise') {
        setError(e.record.observations || 'Falha na análise do documento.')
        setStage('error')
      }
    },
    !!oppId,
  )

  useEffect(() => {
    if (stage !== 'processing') return
    const t1 = setTimeout(() => setProgressStep(1), 3000)
    const t2 = setTimeout(() => setProgressStep(2), 7000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [stage])

  const handleFileSelect = async (selected: FileList | null) => {
    if (!selected || selected.length === 0) return
    const file = selected[0]
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF são aceitos.',
        variant: 'destructive',
      })
      return
    }
    setIsUploading(true)
    try {
      const opp = await createOportunidade({
        titulo: 'Aguardando análise...',
        numero_edital: 'TEMP-' + Date.now(),
        status: 'recebida',
        responsavel: form.responsavel || user?.name || '',
        responsavel_id: user?.id || '',
        observations: '',
      })
      setOppId(opp.id)
      const formData = new FormData()
      formData.append('oportunidade_id', opp.id)
      formData.append('nome_arquivo', file.name)
      formData.append('tipo', 'edital')
      formData.append('arquivo', file)
      await createDocumento(formData)
      setStage('processing')
      setProgressStep(0)
      analyzeCamada1(opp.id).catch(() => {})
    } catch (err: unknown) {
      toast({
        title: 'Erro',
        description: err instanceof Error ? err.message : 'Falha ao criar oportunidade.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewResult = async () => {
    if (!oppId) return
    setIsSaving(true)
    try {
      await updateOportunidade(oppId, {
        titulo: form.titulo,
        numero_edital: form.numero_edital,
        orgao: form.orgao,
        municipio_uf: form.municipio_uf,
        modalidade: form.modalidade,
        data_abertura: form.data_abertura,
        responsavel: form.responsavel,
        observations: form.observations,
      })
      await refreshOpportunities()
      navigate(`/oportunidade/${oppId}`)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar alterações.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRetry = () => {
    setStage('upload')
    setOppId(null)
    setError('')
    setProgressStep(0)
    setForm({
      titulo: '',
      numero_edital: '',
      orgao: '',
      municipio_uf: '',
      modalidade: '',
      data_abertura: '',
      responsavel: user?.name || '',
      observations: '',
    })
  }

  if (stage === 'upload') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Nova Oportunidade</h1>
          <p className="text-slate-500">Faça upload do edital e a IA fará o resto.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={form.responsavel}
              onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              placeholder="Nome do responsável"
            />
          </div>
          <div
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/50 transition-all"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFileSelect(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="mx-auto h-12 w-12 text-[#2563EB] animate-spin mb-4" />
            ) : (
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            )}
            <p className="text-lg font-semibold text-slate-700">
              {isUploading ? 'Enviando...' : 'Arraste o edital aqui ou clique para selecionar'}
            </p>
            <p className="text-sm text-slate-400 mt-2">Apenas arquivos PDF</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'processing') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-[#2563EB] animate-spin mb-4" />
          <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
            {PROGRESS_MESSAGES[progressStep]}
          </h2>
          <p className="text-sm text-slate-500">
            A IA está processando o edital e extraindo os dados.
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={((progressStep + 1) / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-slate-400">
            {PROGRESS_MESSAGES.map((msg, i) => (
              <span key={i} className={i <= progressStep ? 'text-[#2563EB] font-medium' : ''}>
                {msg}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXTRACTION_FIELDS.map((field, i) => (
            <span
              key={field}
              className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {field}
            </span>
          ))}
        </div>
        <div className="border rounded-xl p-6 bg-white space-y-4 shadow-sm">
          <Skeleton className="h-6 w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (stage === 'error') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Falha na Análise</h2>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-[#0D6E3F]" />
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Análise Concluída!</h1>
          <p className="text-slate-500">
            Revise os dados extraídos e confirme para ver o parecer completo.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero_edital">Nº do Edital</Label>
            <Input
              id="numero_edital"
              value={form.numero_edital}
              onChange={(e) => setForm({ ...form, numero_edital: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgao">Órgão</Label>
            <Input
              id="orgao"
              value={form.orgao}
              onChange={(e) => setForm({ ...form, orgao: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="municipio_uf">Município/UF</Label>
            <Input
              id="municipio_uf"
              value={form.municipio_uf}
              onChange={(e) => setForm({ ...form, municipio_uf: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modalidade">Modalidade</Label>
            <Select
              value={form.modalidade}
              onValueChange={(v) => setForm({ ...form, modalidade: v })}
            >
              <SelectTrigger id="modalidade">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {MODALITIES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_abertura">Data de Abertura</Label>
            <Input
              id="data_abertura"
              type="date"
              value={form.data_abertura}
              onChange={(e) => setForm({ ...form, data_abertura: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={form.responsavel}
              onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            rows={3}
            value={form.observations}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
          />
        </div>
      </div>

      <Button
        onClick={handleViewResult}
        disabled={isSaving}
        className="w-full bg-[#2563EB] hover:bg-blue-700 gap-2"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        Ver Resultado da Análise
      </Button>
    </div>
  )
}
