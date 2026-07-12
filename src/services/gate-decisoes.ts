import pb from '@/lib/pocketbase/client'

export const getGateDecisao = (oportunidadeId: string) =>
  pb
    .collection('gate_decisoes')
    .getFirstListItem(`oportunidade_id = "${oportunidadeId}"`)
    .catch(() => null)

export const createGateDecisao = (data: Record<string, unknown>) =>
  pb.collection('gate_decisoes').create(data)

export const updateGateDecisao = (id: string, data: Record<string, unknown>) =>
  pb.collection('gate_decisoes').update(id, data)
