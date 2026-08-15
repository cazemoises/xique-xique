import type { Polo } from './polo'

export interface Banca {
  id: string
  nome: string
  categorias: string[]
  poloId: Polo['id']
  corredor?: string
  rating: number
  distanciaKm: number
  etaMinutos: { min: number; max: number }
  taxaEntrega: number
  taxaEntregaLabel: string
  verificada: boolean
  fotoCapaUrl?: string
  fotoLogoUrl?: string
}
