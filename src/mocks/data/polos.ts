import type { Polo } from '../../domain/polo'
import { marketImage } from './curatedImage'

export const polos: Polo[] = [
  {
    id: 'polo-parque-18',
    nome: 'Parque 18 de Maio',
    endereco: 'Parque 18 de Maio, Caruaru — PE',
    bancasCount: 312,
    abertoAte: '20h',
    fotoUrl: marketImage('polo-parque-18'),
  },
  {
    id: 'polo-sulanca',
    nome: 'Feira da Sulanca',
    endereco: 'Feira da Sulanca, Caruaru — PE',
    bancasCount: 180,
    abertoAte: '14h',
    fotoUrl: marketImage('polo-sulanca'),
  },
]
