import type { Banca } from '../domain/banca'
import type { Produto } from '../domain/produto'

export async function getBancas(poloId?: string): Promise<Banca[]> {
  const url = poloId ? `/api/bancas?poloId=${poloId}` : '/api/bancas'
  const res = await fetch(url)
  return res.json()
}

export async function getBanca(id: string): Promise<Banca> {
  const res = await fetch(`/api/bancas/${id}`)
  if (!res.ok) throw new Error('Banca não encontrada')
  return res.json()
}

export async function getCatalogoDaBanca(bancaId: string): Promise<Produto[]> {
  const res = await fetch(`/api/bancas/${bancaId}/produtos`)
  return res.json()
}
