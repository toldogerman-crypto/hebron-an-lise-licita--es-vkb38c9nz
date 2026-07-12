import pb from '@/lib/pocketbase/client'

export const listMotorAvaliacoes = (oportunidadeId: string) =>
  pb.collection('motor_avaliacoes').getFullList({
    filter: `oportunidade_id = "${oportunidadeId}"`,
    sort: '-created',
  })

export const createMotorAvaliacao = (data: Record<string, unknown>) =>
  pb.collection('motor_avaliacoes').create(data)

export const updateMotorAvaliacao = (id: string, data: Record<string, unknown>) =>
  pb.collection('motor_avaliacoes').update(id, data)

export const deleteMotorAvaliacao = (id: string) => pb.collection('motor_avaliacoes').delete(id)
