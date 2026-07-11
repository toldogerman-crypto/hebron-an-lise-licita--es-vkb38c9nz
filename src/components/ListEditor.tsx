import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface ListEditorProps {
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
  placeholder?: string
}

export function ListEditor({ items, onAdd, onRemove, placeholder }: ListEditorProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button size="icon" onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="gap-1 pr-1.5 py-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {item}
            <button
              onClick={() => onRemove(item)}
              className="ml-0.5 hover:text-rose-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400 italic">Nenhum item cadastrado.</p>
        )}
      </div>
    </div>
  )
}
