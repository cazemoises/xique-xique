import type { ItemPedido, GrupoEntrega, GrupoEntregaBanca } from '../domain/pedido'
import type { Banca } from '../domain/banca'
import type { Polo } from '../domain/polo'

type BancaRef = Pick<Banca, 'id' | 'nome' | 'poloId' | 'taxaEntrega'>
type PoloRef = Pick<Polo, 'id' | 'nome'>

export function consolidateDelivery(
  itens: ItemPedido[],
  bancas: BancaRef[],
  polos: PoloRef[],
): GrupoEntrega[] {
  const bancaById = new Map(bancas.map((b) => [b.id, b]))
  const poloNomeById = new Map(polos.map((p) => [p.id, p.nome]))

  const itensPorPolo = new Map<string, ItemPedido[]>()
  for (const item of itens) {
    const poloId = bancaById.get(item.bancaId)!.poloId
    const grupo = itensPorPolo.get(poloId) ?? []
    grupo.push(item)
    itensPorPolo.set(poloId, grupo)
  }

  return [...itensPorPolo.entries()].map(([poloId, itensDoPolo]) => {
    const bancasDoGrupo: GrupoEntregaBanca[] = []
    const bancaIndex = new Map<string, GrupoEntregaBanca>()
    for (const item of itensDoPolo) {
      let grupoBanca = bancaIndex.get(item.bancaId)
      if (!grupoBanca) {
        grupoBanca = { bancaId: item.bancaId, bancaNome: bancaById.get(item.bancaId)!.nome, itens: [] }
        bancaIndex.set(item.bancaId, grupoBanca)
        bancasDoGrupo.push(grupoBanca)
      }
      grupoBanca.itens.push(item)
    }

    const taxaEntrega = Math.max(
      ...bancasDoGrupo.map((b) => bancaById.get(b.bancaId)!.taxaEntrega),
    )

    return {
      poloId,
      poloNome: poloNomeById.get(poloId)!,
      bancas: bancasDoGrupo,
      taxaEntrega,
    }
  })
}
