import { http, HttpResponse } from 'msw'
import { polos } from './data/polos'
import { bancas } from './data/bancas'
import { produtos } from './data/produtos'
import { pedidoDemo } from './data/pedidos'
import type { OfertaProduto } from '../domain/produto'
import type { Pedido, ItemPedido, MetodoPagamento } from '../domain/pedido'
import { consolidateDelivery } from '../lib/consolidateDelivery'
import { matchesQuery } from '../lib/matchesQuery'

const pedidosCriados = new Map<string, Pedido>([[pedidoDemo.id, pedidoDemo]])

function bancaDe(produtoId: string) {
  const produto = produtos.find((p) => p.id === produtoId)!
  return bancas.find((b) => b.id === produto.bancaId)!
}

export const handlers = [
  http.get('/api/polos', () => HttpResponse.json(polos)),

  http.get('/api/bancas', ({ request }) => {
    const url = new URL(request.url)
    const poloId = url.searchParams.get('poloId')
    const resultado = poloId ? bancas.filter((b) => b.poloId === poloId) : bancas
    return HttpResponse.json(resultado)
  }),

  http.get('/api/bancas/:id', ({ params }) => {
    const banca = bancas.find((b) => b.id === params.id)
    if (!banca) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(banca)
  }),

  http.get('/api/bancas/:id/produtos', ({ params }) => {
    return HttpResponse.json(produtos.filter((p) => p.bancaId === params.id))
  }),

  http.get('/api/produtos/buscar', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    const tamanho = url.searchParams.get('tamanho')
    const precoMax = url.searchParams.get('precoMax')

    const encontrados = produtos
      .filter((p) => matchesQuery(`${p.nome} ${p.categoria}`, q))
      .filter((p) => (tamanho ? p.tamanhos.includes(tamanho) : true))
      .filter((p) => (precoMax ? p.preco <= Number(precoMax) : true))
      .sort((a, b) => a.preco - b.preco)

    if (encontrados.length === 0) return HttpResponse.json([])

    const bancaMaisBarata = bancaDe(encontrados[0].id)

    const ofertas: OfertaProduto[] = encontrados.map((produto, index) => {
      const banca = bancaDe(produto.id)
      const polo = polos.find((p) => p.id === banca.poloId)!
      const mesmaBancaDoMaisBarato = banca.id === bancaMaisBarata.id
      const mesmoPoloDoMaisBarato = banca.poloId === bancaMaisBarata.poloId && !mesmaBancaDoMaisBarato

      return {
        produto,
        banca: { id: banca.id, nome: banca.nome, rating: banca.rating, verificada: banca.verificada },
        poloId: polo.id,
        poloNome: polo.nome,
        badge: index === 0 ? 'MENOR_PRECO' : mesmoPoloDoMaisBarato ? 'MESMA_ENTREGA' : undefined,
        entregaLabel:
          index === 0 || mesmaBancaDoMaisBarato
            ? `Chega hoje · ${banca.distanciaKm} km · ${banca.taxaEntregaLabel}`
            : mesmoPoloDoMaisBarato
              ? `Chega hoje · ${banca.distanciaKm} km · junto com ${bancaMaisBarata.nome}`
              : `Amanhã · ${banca.distanciaKm} km · ${banca.taxaEntregaLabel}`,
      }
    })

    return HttpResponse.json(ofertas)
  }),

  http.get('/api/produtos/:id', ({ params }) => {
    const produto = produtos.find((p) => p.id === params.id)
    if (!produto) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(produto)
  }),

  http.delete('/api/produtos/:id', ({ params }) => {
    const index = produtos.findIndex((p) => p.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    produtos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/pedidos/:id', ({ params }) => {
    const pedido = pedidosCriados.get(String(params.id))
    if (!pedido) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(pedido)
  }),

  http.post('/api/pedidos', async ({ request }) => {
    const body = (await request.json()) as {
      itens: ItemPedido[]
      enderecoEntrega: string
      metodoPagamento: MetodoPagamento
      cupomCodigo?: string
    }

    const gruposEntrega = consolidateDelivery(body.itens, bancas, polos)
    const subtotal = body.itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)
    const taxaEntregaTotal = gruposEntrega.reduce((soma, grupo) => soma + grupo.taxaEntrega, 0)
    const cupomValor = body.cupomCodigo === 'PRIMEIRACOMPRA' ? 6 : undefined

    const pedido: Pedido = {
      id: `pedido-${Math.floor(1000 + Math.random() * 9000)}`,
      gruposEntrega,
      subtotal,
      taxaEntregaTotal,
      cupomCodigo: body.cupomCodigo,
      cupomValor,
      total: subtotal + taxaEntregaTotal - (cupomValor ?? 0),
      enderecoEntrega: body.enderecoEntrega,
      metodoPagamento: body.metodoPagamento,
      status: 'recebido',
      etapas: [
        { label: 'Pedido recebido', horario: 'agora', concluida: true },
        { label: 'Banca confirmou', horario: 'em até 10 min', concluida: false },
        { label: 'Saiu para entrega', horario: '', concluida: false },
        { label: 'Chegou', horario: '', concluida: false },
      ],
    }

    pedidosCriados.set(pedido.id, pedido)
    return HttpResponse.json(pedido, { status: 201 })
  }),
]
