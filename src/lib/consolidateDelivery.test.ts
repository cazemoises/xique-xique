import { describe, expect, test } from 'vitest'
import { consolidateDelivery } from './consolidateDelivery'
import type { ItemPedido } from '../domain/pedido'
import type { Banca } from '../domain/banca'
import type { Polo } from '../domain/polo'

const polos: Pick<Polo, 'id' | 'nome'>[] = [
  { id: 'polo-parque-18', nome: 'Parque 18 de Maio' },
  { id: 'polo-sulanca', nome: 'Feira da Sulanca' },
]

const bancas: Pick<Banca, 'id' | 'nome' | 'poloId' | 'taxaEntrega'>[] = [
  { id: 'banca-dona-zefa', nome: 'Modas Dona Zefa', poloId: 'polo-parque-18', taxaEntrega: 6 },
  { id: 'banca-atelie-nice', nome: 'Ateliê Nice', poloId: 'polo-parque-18', taxaEntrega: 6 },
  { id: 'banca-chita-e-cia', nome: 'Chita & Cia', poloId: 'polo-sulanca', taxaEntrega: 9 },
]

function item(overrides: Partial<ItemPedido>): ItemPedido {
  return {
    produtoId: 'produto-x',
    bancaId: 'banca-dona-zefa',
    nome: 'Produto X',
    tamanho: 'M',
    quantidade: 1,
    precoUnitario: 10,
    ...overrides,
  }
}

describe('consolidateDelivery', () => {
  test('itens de bancas diferentes no mesmo polo consolidam em um único grupo', () => {
    const itens = [
      item({ bancaId: 'banca-dona-zefa' }),
      item({ bancaId: 'banca-atelie-nice' }),
    ]

    const grupos = consolidateDelivery(itens, bancas, polos)

    expect(grupos).toHaveLength(1)
    expect(grupos[0].poloId).toBe('polo-parque-18')
  })

  test('itens de bancas em polos diferentes geram grupos de entrega separados', () => {
    const itens = [
      item({ bancaId: 'banca-dona-zefa' }),
      item({ bancaId: 'banca-chita-e-cia' }),
    ]

    const grupos = consolidateDelivery(itens, bancas, polos)

    expect(grupos).toHaveLength(2)
    expect(grupos.map((g) => g.poloId).sort()).toEqual(
      ['polo-parque-18', 'polo-sulanca'].sort(),
    )
  })

  test('taxa do grupo consolidado é a maior entre as bancas do grupo, não a soma', () => {
    const itens = [
      item({ bancaId: 'banca-dona-zefa' }), // taxa 6
      item({ bancaId: 'banca-atelie-nice' }), // taxa 6
    ]

    const grupos = consolidateDelivery(itens, bancas, polos)

    expect(grupos[0].taxaEntrega).toBe(6)
  })

  test('separa itens por banca dentro do mesmo grupo de entrega', () => {
    const itens = [
      item({ bancaId: 'banca-dona-zefa', nome: 'Vestido vinho' }),
      item({ bancaId: 'banca-atelie-nice', nome: 'Vestido brilho' }),
    ]

    const grupos = consolidateDelivery(itens, bancas, polos)

    expect(grupos[0].bancas).toHaveLength(2)
    expect(grupos[0].bancas.map((b) => b.bancaId).sort()).toEqual(
      ['banca-atelie-nice', 'banca-dona-zefa'].sort(),
    )
  })

  test('lista de itens vazia retorna nenhum grupo', () => {
    expect(consolidateDelivery([], bancas, polos)).toEqual([])
  })
})
