import pb from '@/lib/pocketbase/client'

export const listAnalises = (oportunidadeId: string) =>
  pb.collection('analises').getFullList({
    filter: `oportunidade_id = "${oportunidadeId}"`,
    sort: '-created',
  })

export const createAnalise = (data: Record<string, unknown>) =>
  pb.collection('analises').create(data)

export const deleteAnalise = (id: string) => pb.collection('analises').delete(id)
