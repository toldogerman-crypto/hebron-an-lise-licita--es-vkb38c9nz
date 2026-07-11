import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, ListTodo } from 'lucide-react'
import { Opportunity, ChecklistItem } from '@/lib/types'
import useMainStore from '@/stores/main'
import { cn } from '@/lib/utils'

export function ChecklistTab({ opp }: { opp: Opportunity }) {
  const { updateOpportunity } = useMainStore()
  const [newTask, setNewTask] = useState('')

  const defaultChecklist: ChecklistItem[] = [
    { id: '1', task: 'Analisar restrições do edital (Jurídico)', completed: false },
    { id: '2', task: 'Reunir atestados de capacidade técnica', completed: false },
    { id: '3', task: 'Pesquisa de preço de mercado', completed: false },
    { id: '4', task: 'Validar margem e viabilidade financeira', completed: false },
    { id: '5', task: 'Cadastro da proposta no portal', completed: false },
  ]

  const checklist = opp.checklist || defaultChecklist

  const updateChecklist = (newChecklist: ChecklistItem[]) => {
    updateOpportunity(opp.id, { checklist: newChecklist })
  }

  const toggleTask = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    )
    updateChecklist(updated)
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substring(7),
      task: newTask.trim(),
      completed: false,
    }
    updateChecklist([...checklist, newItem])
    setNewTask('')
  }

  const removeTask = (id: string) => {
    updateChecklist(checklist.filter((item) => item.id !== id))
  }

  const progress =
    checklist.length > 0
      ? Math.round((checklist.filter((i) => i.completed).length / checklist.length) * 100)
      : 0

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" /> Checklist de Acompanhamento
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso da preparação dos documentos e envio da proposta.
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary font-display">{progress}%</span>
              <span className="block text-xs text-slate-500 font-medium">CONCLUÍDO</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-[#0D6E3F] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border transition-colors group hover:bg-slate-50',
                  item.completed ? 'bg-slate-50/50 border-slate-100' : 'border-slate-200 bg-white',
                )}
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleTask(item.id)}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleTask(item.id)}
                    className={
                      item.completed
                        ? 'data-[state=checked]:bg-[#0D6E3F] data-[state=checked]:border-[#0D6E3F]'
                        : ''
                    }
                  />
                  <span
                    className={cn(
                      'text-sm font-medium transition-all',
                      item.completed ? 'text-slate-400 line-through' : 'text-slate-700',
                    )}
                  >
                    {item.task}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeTask(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {checklist.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500 border-2 border-dashed rounded-lg">
                Nenhuma tarefa cadastrada.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
