import type { Pedido } from '../../domain/pedido'

export const pedidoDemo: Pedido = {
  id: 'pedido-4127',
  gruposEntrega: [
    {
      poloId: 'polo-parque-18',
      poloNome: 'Parque 18 de Maio',
      taxaEntrega: 6,
      bancas: [
        {
          bancaId: 'banca-dona-zefa',
          bancaNome: 'Modas Dona Zefa',
          itens: [
            {
              produtoId: 'produto-vestido-midi-vinho',
              bancaId: 'banca-dona-zefa',
              nome: 'Vestido midi de festa — cetim vinho',
              tamanho: 'M',
              quantidade: 1,
              precoUnitario: 89.9,
            },
          ],
        },
      ],
    },
  ],
  subtotal: 89.9,
  taxaEntregaTotal: 6,
  total: 95.9,
  enderecoEntrega: 'Rua São Vicente, 120 — apto 3, Maurício de Nassau, Caruaru — PE',
  metodoPagamento: 'pix',
  status: 'saiu_para_entrega',
  etapas: [
    { label: 'Pedido recebido', horario: 'Hoje, 15:02', concluida: true },
    { label: 'Banca confirmou', horario: 'Hoje, 15:09', concluida: true },
    { label: 'Saiu para entrega', horario: 'Hoje, 16:20', concluida: true },
    { label: 'Chegou', horario: 'Previsto até 19h', concluida: false },
  ],
}

export const chatDemo: { autor: 'comprador' | 'banca'; texto: string }[] = [
  {
    autor: 'comprador',
    texto: 'Pode confirmar se o vestido é tamanho M mesmo? Sou meio entre P e M.',
  },
  {
    autor: 'banca',
    texto: 'Oi! Esse modelo veste um pouco largo, pode ficar tranquila no M ✓',
  },
]
