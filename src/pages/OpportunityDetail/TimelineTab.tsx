import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

export function TimelineTab() {
  const events = [
    {
      date: '15 Ago 2026',
      time: '09:00',
      title: 'Sessão Pública (Abertura)',
      type: 'external',
      status: 'upcoming',
    },
    {
      date: '13 Ago 2026',
      time: '18:00',
      title: 'Prazo Final: Upload de Propostas',
      type: 'internal',
      status: 'upcoming',
    },
    {
      date: '10 Ago 2026',
      time: '14:00',
      title: 'Fechamento de Preços (Comercial)',
      type: 'internal',
      status: 'upcoming',
    },
    {
      date: '05 Ago 2026',
      time: '18:00',
      title: 'Revisão Jurídica de Documentos',
      type: 'internal',
      status: 'upcoming',
    },
    {
      date: '10 Jul 2026',
      time: '10:00',
      title: 'Análise IA Concluída',
      type: 'system',
      status: 'done',
    },
  ]

  return (
    <div className="mt-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" /> Cronograma Reverso
      </h3>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
        {events.map((event, i) => (
          <div key={i} className="relative pl-6">
            <div
              className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white
              ${event.status === 'done' ? 'border-emerald-500' : 'border-slate-300'}
            `}
            >
              {event.status === 'done' && (
                <CheckCircle2 className="h-4 w-4 absolute -left-[2px] -top-[2px] text-emerald-500 bg-white rounded-full" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span
                className={`font-bold text-sm ${event.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}
              >
                {event.date}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {event.time}
              </span>
            </div>

            <div
              className={`mt-1 font-medium ${event.status === 'done' ? 'text-slate-500' : 'text-slate-800'}`}
            >
              {event.title}
            </div>

            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded mt-2 inline-block
              ${event.type === 'external' ? 'bg-rose-100 text-rose-700' : ''}
              ${event.type === 'internal' ? 'bg-blue-100 text-blue-700' : ''}
              ${event.type === 'system' ? 'bg-slate-100 text-slate-600' : ''}
            `}
            >
              {event.type === 'external'
                ? 'Prazo Oficial'
                : event.type === 'internal'
                  ? 'Prazo Interno'
                  : 'Sistema'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
