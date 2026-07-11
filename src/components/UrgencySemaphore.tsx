import { getDaysUntil, getUrgencyLevel, cn } from '@/lib/utils'
import useConfigStore from '@/stores/config'

interface UrgencySemaphoreProps {
  openingDate: string
  className?: string
}

export function UrgencySemaphore({ openingDate, className }: UrgencySemaphoreProps) {
  const { config } = useConfigStore()
  const days = getDaysUntil(openingDate)
  const level = getUrgencyLevel(openingDate, config.minDeadlineDays)

  const levelStyles = {
    green: {
      icon: '🟢',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    yellow: { icon: '🟡', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    red: { icon: '🔴', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  }
  const c = levelStyles[level]

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border',
        c.bg,
        c.border,
        className,
      )}
    >
      <span className="text-sm">{c.icon}</span>
      <div className="flex flex-col leading-none">
        <span className={cn('text-[10px] font-bold uppercase', c.text)}>
          {level === 'green' ? 'Verde' : level === 'yellow' ? 'Amarelo' : 'Vermelho'}
        </span>
        <span className="text-[10px] text-slate-500 mt-0.5">
          {days > 0 ? `${days} dias` : 'Encerrado'}
        </span>
      </div>
    </div>
  )
}
