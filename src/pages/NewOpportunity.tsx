import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, UploadCloud, File as FileIcon, X, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { Opportunity, OpportunityStatus } from '@/lib/types'

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

const STATUSES: { value: OpportunityStatus; label: string }[] = [
  { value: 'recebida', label: 'Recebida' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aguardando_decisao', label: 'Aguardando Decisão' },
  { value: 'em_preparacao', label: 'Em Preparação' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'encerrada', label: 'Encerrada' },
]

export default function NewOpportunity() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addOpportunity } = useMainStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    number: '',
    organ: '',
    cityState: '',
    modality: '',
    openingDate: '',
    responsible: '',
    status: 'recebida' as OpportunityStatus,
    observations: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleFileSelect = (selected: FileList | null) => {
    if (selected) {
      const pdfFiles = Array.from(selected).filter(
        (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'),
      )
      setFiles((prev) => [...prev, ...pdfFiles])
    }
  }

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.number) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título e número do edital.',
        variant: 'destructive',
      })
      return
    }
    setIsSaving(true)
    const [city, state] = form.cityState.split('/').map((s) => s.trim())
    const opp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: form.title,
      number: form.number,
      organ: form.organ,
      modality: form.modality || 'Não informada',
      status: form.status,
      verdict: 'Pendente',
      score: 0,
      dateAdded: new Date().toISOString(),
      dueDate: form.openingDate || '',
      openingDate: form.openingDate || '',
      state: state || '',
      city: city || '',
      portal: '',
      responsible: form.responsible,
      observations: form.observations,
      radarSynced: false,
      files: files.map((f) => f.name),
      checklist: [
        { id: '1', task: 'Analisar restrições do edital (Jurídico)', completed: false },
        { id: '2', task: 'Reunir atestados de capacidade técnica', completed: false },
        { id: '3', task: 'Pesquisa de preço de mercado', completed: false },
        { id: '4', task: 'Validar margem e viabilidade financeira', completed: false },
        { id: '5', task: 'Cadastro da proposta no portal', completed: false },
      ],
    }
    try {
      await addOpportunity(opp, files)
      toast({
        title: 'Oportunidade criada!',
        description: 'O processo foi registrado com sucesso.',
      })
      navigate('/radar')
    } catch (err: unknown) {
      toast({
        title: 'Erro',
        description: err instanceof Error ? err.message : 'Falha ao salvar.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2 text-slate-500"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
      </Button>
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Nova Oportunidade</h1>
        <p className="text-slate-500">Cadastre uma nova oportunidade de licitação.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informações do Edital</CardTitle>
            <CardDescription>Preencha os dados principais do processo licitatório.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Serviços de Consultoria em TI"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Nº do Edital *</Label>
                <Input
                  id="number"
                  placeholder="Ex: PE 045/2026"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organ">Órgão / Entidade</Label>
                <Input
                  id="organ"
                  placeholder="Ex: Ministério do Meio Ambiente"
                  value={form.organ}
                  onChange={(e) => setForm({ ...form, organ: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cityState">Município/UF</Label>
                <Input
                  id="cityState"
                  placeholder="Ex: Lages/SC"
                  value={form.cityState}
                  onChange={(e) => setForm({ ...form, cityState: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade</Label>
                <Select
                  value={form.modality}
                  onValueChange={(v) => setForm({ ...form, modality: v })}
                >
                  <SelectTrigger id="modality">
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
                <Label htmlFor="openingDate">Data de Abertura</Label>
                <Input
                  id="openingDate"
                  type="date"
                  value={form.openingDate}
                  onChange={(e) => setForm({ ...form, openingDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  placeholder="Ex: Carlos Eduardo"
                  value={form.responsible}
                  onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as OpportunityStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                rows={3}
                placeholder="Anotações iniciais sobre o edital..."
                value={form.observations}
                onChange={(e) => setForm({ ...form, observations: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Documentos (PDF)</CardTitle>
            <CardDescription>Anexe editais, anexos e documentos relacionados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleFileSelect(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                Arraste PDFs aqui ou clique para selecionar
              </p>
              <p className="text-xs text-slate-400 mt-1">Apenas arquivos PDF</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileIcon className="h-5 w-5 text-rose-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeFile(i)}
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#2563EB] hover:bg-blue-700"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Oportunidade'}
          </Button>
        </div>
      </form>
    </div>
  )
}
