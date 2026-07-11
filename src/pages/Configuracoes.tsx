import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TagInput } from '@/components/TagInput'
import useConfigStore from '@/stores/config'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  RotateCcw,
  Percent,
  CalendarClock,
  Target,
  MapPin,
  Ban,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'

export default function Configuracoes() {
  const { config, updateConfig, resetConfig } = useConfigStore()
  const { toast } = useToast()
  const [margin, setMargin] = useState(String(config.minMargin))
  const [deadline, setDeadline] = useState(String(config.minDeadlineDays))

  const noBackend = !import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SKIP_CLOUD

  const handleSave = () => {
    const m = Math.max(0, Number(margin) || 0)
    const d = Math.max(0, Number(deadline) || 0)
    updateConfig({ minMargin: m, minDeadlineDays: d })
    toast({
      title: 'Configurações salvas!',
      description: 'Os parâmetros do motor de análise foram atualizados.',
    })
  }

  const handleReset = () => {
    resetConfig()
    setMargin('15')
    setDeadline('3')
    toast({
      title: 'Padrões restaurados',
      description: 'Todas as configurações voltaram ao valor original.',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Configurações do Sistema
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Parâmetros do motor de análise e triagem de editais.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Restaurar Padrões
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-[#2563EB] hover:bg-blue-700">
            <Save className="h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      {noBackend && (
        <Alert className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm font-medium">
            ⚠️ Nenhum backend conectado. As alterações de configuração são temporárias e serão
            perdidas ao recarregar a página.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Percent className="h-5 w-5 text-[#2563EB]" /> Margem Mínima
            </CardTitle>
            <CardDescription>
              Percentual mínimo para validar viabilidade da proposta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className="w-28"
              />
              <span className="text-lg font-bold text-slate-700">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Usado no Portão de Decisão (Q4). Padrão: 15%.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-5 w-5 text-[#2563EB]" /> Prazo Mínimo de Preparação
            </CardTitle>
            <CardDescription>Dias úteis mínimos para preparar a proposta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-28"
              />
              <span className="text-lg font-bold text-slate-700">dias</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Controla o Semáforo de Urgência e trava de "Não Entrar". Padrão: 3 dias.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-[#0D6E3F]" /> Alinhamento Estratégico
          </CardTitle>
          <CardDescription>
            CNAEs e segmentos que bonificam o score (+20 e +15 pontos).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              CNAEs Compatíveis (+20 pontos)
            </Label>
            <TagInput
              tags={config.priorityCNAEs}
              onChange={(tags) => updateConfig({ priorityCNAEs: tags })}
              placeholder="Ex: 6201-5/01 - Desenvolvimento de Software"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              Segmentos Prioritários (+15 pontos)
            </Label>
            <TagInput
              tags={config.prioritySegments}
              onChange={(tags) => updateConfig({ prioritySegments: tags })}
              placeholder="Ex: Tecnologia, Higiene, Mobiliário"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-[#7C3AED]" /> Regiões e Exclusões
          </CardTitle>
          <CardDescription>Regras regionais e travas eliminatórias automáticas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Regiões Prioritárias</Label>
            <TagInput
              tags={config.priorityRegions}
              onChange={(tags) => updateConfig({ priorityRegions: tags })}
              placeholder="Ex: Sul, Sudeste"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block flex items-center gap-1">
              <Ban className="h-4 w-4 text-rose-500" /> Exclusões Automáticas ("NÃO ENTRAR")
            </Label>
            <TagInput
              tags={config.exclusionRules}
              onChange={(tags) => updateConfig({ exclusionRules: tags })}
              placeholder="Ex: Engenharia Civil, Combustíveis, Licitação Internacional"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
