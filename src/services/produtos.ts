import type { Produto, OfertaProduto } from '../domain/produto'

export async function getProduto(id: string): Promise<Produto> {
  const res = await fetch(`/api/produtos/${id}`)
  if (!res.ok) throw new Error('Produto não encontrado')
  return res.json()
}

export interface BuscarProdutosParams {
  q?: string
  tamanho?: string
  precoMax?: number
}

export async function buscarProdutos(params: BuscarProdutosParams): Promise<OfertaProduto[]> {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.tamanho) searchParams.set('tamanho', params.tamanho)
  if (params.precoMax) searchParams.set('precoMax', String(params.precoMax))
  const res = await fetch(`/api/produtos/buscar?${searchParams}`)
  return res.json()
}

export async function removerProduto(id: string): Promise<void> {
  const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Não foi possível remover a peça')
}
