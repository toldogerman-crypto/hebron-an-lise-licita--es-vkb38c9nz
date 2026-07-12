import pb from '@/lib/pocketbase/client'

export const listConfig = () => pb.collection('config').getFullList()

export const getConfig = (chave: string) =>
  pb
    .collection('config')
    .getFirstListItem(`chave = "${chave}"`)
    .catch(() => null)

export const setConfig = (chave: string, valor: string) =>
  getConfig(chave).then((existing: any) => {
    if (existing) {
      return pb.collection('config').update(existing.id, { valor })
    }
    return pb.collection('config').create({ chave, valor })
  })
