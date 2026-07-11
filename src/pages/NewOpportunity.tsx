import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UploadCloud, File, X, BrainCircuit } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function NewOpportunity() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.length) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    setStep(3)
    // Simulate AI Processing
    setTimeout(() => {
      toast({
        title: 'Análise Concluída',
        description: 'A IA finalizou a leitura do edital.',
      })
      navigate('/oportunidade/1')
    }, 3000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar Nova Licitação</h1>
        <p className="text-slate-500">
          Preencha os dados básicos e faça o upload dos arquivos para análise.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className={step >= 1 ? 'text-primary' : 'text-slate-400'}>Dados Cadastrais</span>
            <span className={step >= 2 ? 'text-primary' : 'text-slate-400'}>Upload</span>
            <span className={step >= 3 ? 'text-primary' : 'text-slate-400'}>Processamento</span>
          </div>
          <Progress value={step * 33.33} className="h-2" />
        </div>
      </div>

      {step === 1 && (
        <Card className="shadow-sm border-slate-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>Dados preliminares para identificação no Radar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Objeto da Licitação</Label>
              <Input id="title" placeholder="Ex: Contratação de serviços de consultoria..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número / Ano</Label>
                <Input id="number" placeholder="Ex: 001/2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organ">Órgão Promotor</Label>
                <Input id="organ" placeholder="Ex: Ministério da Saúde" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pregao">Pregão Eletrônico</SelectItem>
                    <SelectItem value="concorrencia">Concorrência</SelectItem>
                    <SelectItem value="tomada">Tomada de Preços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portal">Portal (URL opcional)</Label>
                <Input id="portal" type="url" placeholder="https://..." />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-4 bg-slate-50 rounded-b-xl">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={() => setStep(2)}>Avançar para Upload</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-sm border-slate-200 animate-slide-up">
          <CardHeader>
            <CardTitle>Documentos do Edital</CardTitle>
            <CardDescription>
              Faça o upload do Edital, Termo de Referência e Anexos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 font-medium">Arraste e solte os arquivos aqui</p>
              <p className="text-sm text-slate-400 mt-1">ou clique para selecionar (PDF, DOCX)</p>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Arquivos Selecionados</Label>
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                      <X className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 bg-slate-50 rounded-b-xl">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={files.length === 0}
              className="bg-primary text-primary-foreground gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              Iniciar Análise Técnica
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-sm border-slate-200 text-center py-16 animate-fade-in">
          <CardContent className="space-y-6">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">IA Analisando Documentos...</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Extraindo requisitos, mapeando riscos e gerando o parecer executivo. Isso pode levar
                alguns minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
