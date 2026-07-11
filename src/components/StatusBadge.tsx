import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { OpportunityStatus, Verdict, ResultStatus } from '@/lib/types'

interface StatusBadgeProps {
  status?: OpportunityStatus
  verdict?: Verdict
  resultado?: ResultStatus | null
  className?: string
}

export function StatusBadge({ status, verdict, resultado, className }: StatusBadgeProps) {
  if (resultado) {
    const resConfig = {
      ganhou: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
      perdeu: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
      nao_participou: 'bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB]',
    }
    const labels = {
      ganhou: '🏆 GANHOU',
      perdeu: 'PERDEU',
      nao_participou: 'NÃO PARTICIPOU',
    }
    return (
      <Badge
        className={cn(
          'font-bold font-display px-2 py-0.5 shadow-sm',
          resConfig[resultado],
          className,
        )}
      >
        {labels[resultado]}
      </Badge>
    )
  }

  if (verdict) {
    const verdictConfig = {
      ENTRAR: 'bg-[#0D6E3F] hover:bg-[#065F46] text-white border-transparent',
      'ANALISAR MAIS': 'bg-[#B8860B] hover:bg-[#926C08] text-white border-transparent',
      'NÃO ENTRAR': 'bg-[#8B1A1A] hover:bg-[#7F1D1D] text-white border-transparent',
      Pendente: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    }
    return (
      <Badge className={cn('font-bold font-display shadow-sm', verdictConfig[verdict], className)}>
        {verdict === 'ENTRAR' && '✓ '}
        {verdict === 'ANALISAR MAIS' && '⚠ '}
        {verdict === 'NÃO ENTRAR' && '✗ '}
        {verdict}
      </Badge>
    )
  }

  if (status) {
    const isProcessing = status === 'sessao'
    const statusConfig = {
      interesse: 'bg-amber-100 text-amber-700 border-amber-200',
      aguardando: 'bg-blue-100 text-blue-700 border-blue-200',
      sessao: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      finalizado: 'bg-slate-100 text-slate-700 border-slate-200',
    }
    const labels = {
      interesse: 'Interesse',
      aguardando: 'Aguardando Abertura',
      sessao: 'Em Sessão',
      finalizado: 'Finalizado',
    }

    return (
      <Badge
        variant="outline"
        className={cn(
          'font-semibold font-display tracking-wide',
          statusConfig[status] || 'bg-slate-100 text-slate-700',
          isProcessing && 'animate-pulse-subtle',
          className,
        )}
      >
        {labels[status]}
      </Badge>
    )
  }

  return null
}
