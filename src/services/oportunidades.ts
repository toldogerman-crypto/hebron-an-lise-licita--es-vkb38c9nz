import pb from '@/lib/pocketbase/client'

export const listOportunidades = () =>
  pb.collection('oportunidades').getFullList({ sort: '-created' })

export const getOportunidade = (id: string) => pb.collection('oportunidades').getOne(id)

export const createOportunidade = (data: Record<string, unknown> | FormData) =>
  pb.collection('oportunidades').create(data)

export const updateOportunidade = (id: string, data: Record<string, unknown> | FormData) =>
  pb.collection('oportunidades').update(id, data)

export const deleteOportunidade = (id: string) => pb.collection('oportunidades').delete(id)

export const analyzeCamada1 = (oportunidadeId: string) =>
  pb.send('/backend/v1/analyze/camada1', {
    method: 'POST',
    body: JSON.stringify({ oportunidade_id: oportunidadeId }),
    headers: { 'Content-Type': 'application/json' },
  })

export const analyzeDeep = (oportunidadeId: string, tipo: string) =>
  pb.send('/backend/v1/analyze/deep', {
    method: 'POST',
    body: JSON.stringify({ oportunidade_id: oportunidadeId, tipo }),
    headers: { 'Content-Type': 'application/json' },
  })
