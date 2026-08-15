import type { Polo } from '../../domain/polo'
import { placeholderImage } from './placeholderImage'

export const polos: Polo[] = [
  {
    id: 'polo-parque-18',
    nome: 'Parque 18 de Maio',
    endereco: 'Parque 18 de Maio, Caruaru — PE',
    bancasCount: 312,
    abertoAte: '20h',
    fotoUrl: placeholderImage('polo-parque-18', 600, 400),
  },
  {
    id: 'polo-sulanca',
    nome: 'Feira da Sulanca',
    endereco: 'Feira da Sulanca, Caruaru — PE',
    bancasCount: 180,
    abertoAte: '14h',
    fotoUrl: placeholderImage('polo-sulanca', 600, 400),
  },
]
