import type { Banca } from './banca'
import type { Polo } from './polo'

export interface Produto {
  id: string
  bancaId: Banca['id']
  nome: string
  categoria: string
  preco: number
  precoAntigo?: number
  tamanhos: string[]
  medidas?: Record<string, string>
  fotos: string[]
}

export type BadgeOferta = 'MENOR_PRECO' | 'MESMA_ENTREGA'

export interface OfertaProduto {
  produto: Produto
  banca: Pick<Banca, 'id' | 'nome' | 'rating' | 'verificada'>
  poloId: Polo['id']
  poloNome: string
  badge?: BadgeOferta
  entregaLabel: string
}
