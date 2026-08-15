import type { Pedido, ItemPedido, MetodoPagamento } from '../domain/pedido'

export interface CriarPedidoInput {
  itens: ItemPedido[]
  enderecoEntrega: string
  metodoPagamento: MetodoPagamento
  cupomCodigo?: string
}

export async function criarPedido(input: CriarPedidoInput): Promise<Pedido> {
  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Não foi possível criar o pedido')
  return res.json()
}

export async function getPedido(id: string): Promise<Pedido> {
  const res = await fetch(`/api/pedidos/${id}`)
  if (!res.ok) throw new Error('Pedido não encontrado')
  return res.json()
}
