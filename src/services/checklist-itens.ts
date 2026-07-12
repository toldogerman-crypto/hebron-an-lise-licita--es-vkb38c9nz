import pb from '@/lib/pocketbase/client'

export const listChecklistItens = (oportunidadeId: string) =>
  pb.collection('checklist_itens').getFullList({
    filter: `oportunidade_id = "${oportunidadeId}"`,
    sort: 'created',
  })

export const createChecklistItem = (data: Record<string, unknown>) =>
  pb.collection('checklist_itens').create(data)

export const updateChecklistItem = (id: string, data: Record<string, unknown>) =>
  pb.collection('checklist_itens').update(id, data)

export const deleteChecklistItem = (id: string) => pb.collection('checklist_itens').delete(id)
