import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Lock, AlertCircle, HelpCircle } from 'lucide-react'
import { DecisionQuestion } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface DecisionGateTabProps {
  questions?: DecisionQuestion[]
  oppId: string
}

export function DecisionGateTab({ questions, oppId }: DecisionGateTabProps) {
  const { toast } = useToast()
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    questions ? Object.fromEntries(questions.map((q) => [q.id, q.answer])) : {},
  )
  const [confirmed, setConfirmed] = useState(false)

  if (!questions) {
    return (
      <div className="mt-6 text-center py-12 text-slate-500">Portão de decisão não disponível.</div>
    )
  }

  const allAnswered = questions.every((q) => answers[q.id] !== null)

  const computeVerdict = () => {
    if (answers[1] === true) return 'NÃO ENTRAR'
    if (answers[2] === false) return 'NÃO ENTRAR'
    if (questions.every((q) => answers[q.id] === true)) return 'ENTRAR'
    return 'ANALISAR MAIS'
  }

  const verdict = computeVerdict()
  const verdictConfig = {
    ENTRAR: 'bg-[#0D6E3F] text-white',
    'NÃO ENTRAR': 'bg-[#8B1A1A] text-white',
    'ANALISAR MAIS': 'bg-[#B8860B] text-white',
  }

  const handleConfirm = () => {
    setConfirmed(true)
    toast({
      title: `Decisão Registrada: ${verdict}`,
      description: 'O resultado foi sincronizado com o Radar (Google Sheets).',
    })
  }

  return (
    <div className="mt-6 max-w-3xl mx-auto space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Portão de Decisão do Gestor
          </CardTitle>
          <CardDescription>
            Responda às 5 perguntas obrigatórias para finalizar a decisão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className={cn(
                'p-4 rounded-lg border',
                answers[q.id] === false && q.id <= 2
                  ? 'border-rose-200 bg-rose-50/50'
                  : 'border-slate-200',
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{q.id}</span>
                    <p className="text-sm font-medium text-slate-900">{q.question}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" /> {q.hint}
                  </p>
                </div>
                {q.autoFilled && (
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    Auto
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={answers[q.id] === true ? 'default' : 'outline'}
                  className={cn(
                    'gap-1',
                    answers[q.id] === true && 'bg-[#0D6E3F] hover:bg-[#065F46] text-white',
                  )}
                  disabled={q.autoFilled}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                >
                  <CheckCircle2 className="h-4 w-4" /> Sim
                </Button>
                <Button
                  size="sm"
                  variant={answers[q.id] === false ? 'default' : 'outline'}
                  className={cn(
                    'gap-1',
                    answers[q.id] === false && 'bg-[#8B1A1A] hover:bg-[#7F1D1D] text-white',
                  )}
                  disabled={q.autoFilled}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                >
                  <XCircle className="h-4 w-4" /> Não
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={cn('shadow-sm border-2', confirmed ? 'border-primary' : 'border-slate-200')}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Veredicto Calculado
              </p>
              <span
                className={cn(
                  'text-2xl font-black font-display px-4 py-2 rounded-lg',
                  verdictConfig[verdict],
                )}
              >
                {verdict}
              </span>
            </div>
            <Button
              onClick={handleConfirm}
              disabled={!allAnswered || confirmed}
              size="lg"
              className={cn(
                'gap-2 font-display font-semibold',
                confirmed ? 'bg-slate-100 text-slate-500' : 'bg-[#2563EB] hover:bg-blue-700',
              )}
              variant={confirmed ? 'outline' : 'default'}
            >
              <CheckCircle2 className="h-5 w-5" />{' '}
              {confirmed ? 'Decisão Registrada' : 'Gravar Decisão'}
            </Button>
          </div>
          {!allAnswered && (
            <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Responda todas as perguntas para confirmar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
