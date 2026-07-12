import pb from '@/lib/pocketbase/client'

export const listDocumentos = (oportunidadeId: string) =>
  pb.collection('documentos').getFullList({
    filter: `oportunidade_id = "${oportunidadeId}"`,
    sort: '-created',
  })

export const createDocumento = (data: Record<string, unknown> | FormData) =>
  pb.collection('documentos').create(data)

export const deleteDocumento = (id: string) => pb.collection('documentos').delete(id)

export const getDocumentoUrl = (record: any, filename: string) => pb.files.getUrl(record, filename)
