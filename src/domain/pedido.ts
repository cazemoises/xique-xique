export interface ItemPedido {
  produtoId: string
  bancaId: string
  nome: string
  tamanho: string
  quantidade: number
  precoUnitario: number
}

export interface GrupoEntregaBanca {
  bancaId: string
  bancaNome: string
  itens: ItemPedido[]
}

export interface GrupoEntrega {
  poloId: string
  poloNome: string
  bancas: GrupoEntregaBanca[]
  taxaEntrega: number
}

export type StatusPedido =
  | 'recebido'
  | 'confirmado'
  | 'saiu_para_entrega'
  | 'entregue'

export interface EtapaAcompanhamento {
  label: string
  horario: string
  concluida: boolean
}

export type MetodoPagamento = 'pix' | 'dinheiro' | 'cartao'

export interface Pedido {
  id: string
  gruposEntrega: GrupoEntrega[]
  subtotal: number
  taxaEntregaTotal: number
  cupomCodigo?: string
  cupomValor?: number
  total: number
  enderecoEntrega: string
  metodoPagamento: MetodoPagamento
  status: StatusPedido
  etapas: EtapaAcompanhamento[]
}
