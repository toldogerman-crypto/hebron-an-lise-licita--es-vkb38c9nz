import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { OpportunityStatus, Verdict } from '@/lib/types'

interface StatusBadgeProps {
  status?: OpportunityStatus
  verdict?: Verdict
  className?: string
}

export function StatusBadge({ status, verdict, className }: StatusBadgeProps) {
  if (verdict) {
    const verdictConfig = {
      Entrar: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      'Analisar Mais': 'bg-amber-500 hover:bg-amber-600 text-white',
      'Não Entrar': 'bg-rose-500 hover:bg-rose-600 text-white',
      Pendente: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    }
    return (
      <Badge className={cn('font-medium shadow-sm', verdictConfig[verdict], className)}>
        {verdict}
      </Badge>
    )
  }

  if (status) {
    const isProcessing = status === 'Em Análise'
    const statusConfig: Record<string, string> = {
      Recebida: 'bg-slate-200 text-slate-700',
      'Em Análise': 'bg-blue-100 text-blue-700 border-blue-200',
      'Documentação Incompleta': 'bg-amber-100 text-amber-700 border-amber-200',
      'Analisar Mais': 'bg-amber-100 text-amber-700 border-amber-200',
      Entrar: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Não Entrar': 'bg-rose-100 text-rose-700 border-rose-200',
      'Em Preparação': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      Enviada: 'bg-emerald-500 text-white',
    }

    return (
      <Badge
        variant="outline"
        className={cn(
          'font-medium',
          statusConfig[status] || 'bg-slate-100 text-slate-700',
          isProcessing && 'animate-pulse-subtle',
          className,
        )}
      >
        {status}
      </Badge>
    )
  }

  return null
}
