import { ScoreItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ScoreBreakdownProps {
  items: ScoreItem[]
  total: number
  className?: string
}

export function ScoreBreakdown({ items, total, className }: ScoreBreakdownProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Decomposição do Score</span>
        <span className="text-xl font-black text-primary">{total}/100</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-slate-600">{item.label}</span>
              <span
                className="text-blue-500 bg-blue-50 px-1 rounded cursor-help"
                title={item.source}
              >
                [Fonte]
              </span>
            </div>
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  item.points === 0 ? 'bg-rose-400' : 'bg-primary',
                )}
                style={{ width: `${(item.points / item.max) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                'w-10 text-right font-medium',
                item.points === 0 ? 'text-rose-500' : 'text-slate-700',
              )}
            >
              +{item.points}/{item.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
