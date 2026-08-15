import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { TopNav } from '../components/TopNav'
import { useAsync } from '../hooks/useAsync'
import { getBancas } from '../services/bancas'
import { getPolos } from '../services/polos'
import { criarPedido } from '../services/pedidos'
import { consolidateDelivery } from '../lib/consolidateDelivery'
import { formatPrice } from '../lib/formatPrice'
import { useCart } from '../state/CartContext'

const ENDERECO = 'Rua São Vicente, 120 — apto 3, Maurício de Nassau, Caruaru — PE'

export function Cart() {
  const { itens, cupomCodigo, aplicarCupom, limparCarrinho } = useCart()
  const { data: bancas } = useAsync(() => getBancas(), [])
  const { data: polos } = useAsync(() => getPolos(), [])
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  const grupos = useMemo(
    () => (bancas && polos ? consolidateDelivery(itens, bancas, polos) : []),
    [itens, bancas, polos],
  )

  const subtotal = itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)
  const taxaEntregaTotal = grupos.reduce((soma, grupo) => soma + grupo.taxaEntrega, 0)
  const cupomValor = cupomCodigo === 'PRIMEIRACOMPRA' ? 6 : 0
  const total = subtotal + taxaEntregaTotal - cupomValor

  async function finalizarPedido() {
    setEnviando(true)
    try {
      const pedido = await criarPedido({
        itens,
        enderecoEntrega: ENDERECO,
        metodoPagamento: 'pix',
        cupomCodigo,
      })
      limparCarrinho()
      navigate(`/pedido/${pedido.id}`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Screen>
      <TopNav title="Sua sacola" />

      <div className="lg:hidden">
        <TopBar title="Sua sacola" />
      </div>

      <div className="flex-1 px-4 pt-3.5 lg:hidden">
        {itens.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-2">Sua sacola está vazia.</p>
        )}

        {itens.length > 0 && (
          <>
            <div className="rounded-2xl border border-sand-border bg-white p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-2">Entregar em</span>
                <span className="text-xs font-semibold text-terracota">trocar</span>
              </div>
              <p className="mb-0 mt-1.75 text-sm font-semibold leading-snug">{ENDERECO}</p>
            </div>

            {grupos.length > 1 && (
              <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-ocre p-3.25">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
                  <path d="M12 9v4M12 17h.01" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                <span className="text-xs leading-snug text-ink">
                  Suas peças vêm de {grupos.length} feiras diferentes: {grupos.length} entregas separadas nesse pedido.
                </span>
              </div>
            )}

            {grupos.map((grupo) => (
              <div key={grupo.poloId} className="mt-3 rounded-2xl border border-sand-border bg-white p-3.5">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="rounded-full bg-oliva px-2 py-1.25 text-2xs font-bold tracking-wide text-white">
                    {grupo.bancas.length > 1 ? 'MESMA FEIRA · 1 ENTREGA' : 'GRUPO DE ENTREGA'}
                  </span>
                  <span className="text-xs text-muted-2">{grupo.poloNome}</span>
                </div>
                {grupo.bancas.map((gb) => (
                  <div key={gb.bancaId} className="mb-2">
                    <div className="flex items-center gap-2.25 border-b border-sand-border pb-2">
                      <span className="text-sm font-bold">{gb.bancaNome}</span>
                    </div>
                    {gb.itens.map((item) => (
                      <div
                        key={`${item.produtoId}-${item.tamanho}`}
                        className="flex items-center gap-2.75 border-b border-sand-border py-2.5"
                      >
                        <div className="flex flex-1 flex-col gap-0.75">
                          <span className="text-sm leading-snug">{item.nome}</span>
                          <span className="text-xs text-muted-2">Tam. {item.tamanho}</span>
                          <span className="text-sm font-bold">{formatPrice(item.precoUnitario)}</span>
                        </div>
                        <span className="text-xs font-semibold text-faded">{item.quantidade}×</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="flex justify-between pt-0.5 text-xs font-medium text-muted-3">
                  <span>Entrega deste grupo</span>
                  <span>{formatPrice(grupo.taxaEntrega)}</span>
                </div>
              </div>
            ))}

            <div className="mt-3 flex flex-col gap-2.25 rounded-2xl border border-sand-border bg-white p-3.5 text-xs text-muted-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entregas ({grupos.length} {grupos.length === 1 ? 'grupo' : 'grupos'})</span>
                <span>{formatPrice(taxaEntregaTotal)}</span>
              </div>
              {cupomValor > 0 && (
                <div className="flex justify-between text-oliva">
                  <span>Cupom {cupomCodigo}</span>
                  <span>− {formatPrice(cupomValor)}</span>
                </div>
              )}
              {!cupomCodigo && (
                <button
                  type="button"
                  onClick={() => aplicarCupom('PRIMEIRACOMPRA')}
                  className="self-start text-xs font-semibold text-terracota"
                >
                  Aplicar cupom PRIMEIRACOMPRA
                </button>
              )}
              <div className="flex justify-between border-t border-sand-border pt-2.25 font-display text-base font-bold text-ink">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2.75 rounded-2xl border border-sand-border bg-white p-3.5">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-verified-bg text-xs font-bold text-oliva">
                Pix
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold">Pagar com Pix</span>
                <span className="text-xs text-muted-2">Dinheiro e cartão na entrega também</span>
              </div>
            </div>
            <div className="h-28" />
          </>
        )}
      </div>

      {itens.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-sand-border bg-white px-4.5 py-3.5 pb-7.5 md:sticky md:inset-x-auto lg:hidden">
          <button
            type="button"
            disabled={enviando}
            onClick={finalizarPedido}
            className="w-full rounded-2xl bg-terracota py-4 text-center text-lg font-bold text-white shadow-cta disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : `Fazer pedido · ${formatPrice(total)}`}
          </button>
          <p className="mb-0 mt-2.25 text-center text-xs text-muted-2">
            Cada banca confirma o próprio grupo em até 10 min
          </p>
        </div>
      )}

      <div className="mx-auto hidden w-full max-w-page-narrow flex-1 gap-7 px-8 py-11 lg:grid lg:grid-cols-[1fr_25rem] lg:items-start">
        {itens.length === 0 && (
          <p className="col-span-2 mt-10 text-center text-sm text-muted-2">Sua sacola está vazia.</p>
        )}

        {itens.length > 0 && (
          <>
            <div className="flex flex-col gap-4.5">
              <div className="rounded-2xl border border-sand-border bg-white p-4.5 shadow-[0_8px_24px_rgba(140,74,58,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-2">Entregar em</span>
                  <span className="text-xs font-semibold text-terracota">trocar</span>
                </div>
                <p className="mb-0 mt-2 text-base font-semibold leading-snug">{ENDERECO}</p>
              </div>

              {grupos.length > 1 && (
                <div className="flex items-start gap-2.75 rounded-2xl bg-ocre p-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
                    <path d="M12 9v4M12 17h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  <span className="text-sm leading-snug text-ink">
                    Suas peças vêm de {grupos.length} feiras diferentes: {grupos.length} entregas separadas nesse pedido.
                  </span>
                </div>
              )}

              {grupos.map((grupo) => (
                <div key={grupo.poloId} className="rounded-2xl border border-sand-border bg-white p-4.5 shadow-[0_8px_24px_rgba(140,74,58,0.06)]">
                  <div className="mb-3 flex items-center gap-2.25">
                    <span className="rounded-full bg-oliva px-2.25 py-1.25 text-xs font-bold tracking-wide text-white">
                      {grupo.bancas.length > 1 ? 'MESMA FEIRA · 1 ENTREGA' : 'GRUPO DE ENTREGA'}
                    </span>
                    <span className="text-sm text-muted-2">{grupo.poloNome}</span>
                  </div>
                  {grupo.bancas.map((gb) => (
                    <div key={gb.bancaId} className="mb-2">
                      <div className="flex items-center gap-2.25 border-b border-sand-border pb-2">
                        <span className="text-sm font-bold">{gb.bancaNome}</span>
                      </div>
                      {gb.itens.map((item) => (
                        <div
                          key={`${item.produtoId}-${item.tamanho}`}
                          className="flex items-center gap-3 border-b border-sand-border py-3"
                        >
                          <div className="flex flex-1 flex-col gap-1">
                            <span className="text-sm leading-snug">{item.nome}</span>
                            <span className="text-xs text-muted-2">Tam. {item.tamanho}</span>
                            <span className="text-sm font-bold">{formatPrice(item.precoUnitario)}</span>
                          </div>
                          <span className="text-xs font-semibold text-faded">{item.quantidade}×</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 text-xs font-medium text-muted-3">
                    <span>Entrega deste grupo</span>
                    <span>{formatPrice(grupo.taxaEntrega)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky top-24 flex flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-3xl bg-white p-5.5 shadow-[0_20px_50px_rgba(140,74,58,0.14)]">
                <span className="font-display text-base font-bold">Resumo do pedido</span>
                <div className="flex flex-col gap-2 text-sm text-muted-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entregas ({grupos.length} {grupos.length === 1 ? 'grupo' : 'grupos'})</span>
                    <span>{formatPrice(taxaEntregaTotal)}</span>
                  </div>
                  {cupomValor > 0 && (
                    <div className="flex justify-between text-oliva">
                      <span>Cupom {cupomCodigo}</span>
                      <span>− {formatPrice(cupomValor)}</span>
                    </div>
                  )}
                  {!cupomCodigo && (
                    <button
                      type="button"
                      onClick={() => aplicarCupom('PRIMEIRACOMPRA')}
                      className="self-start text-sm font-semibold text-terracota"
                    >
                      Aplicar cupom PRIMEIRACOMPRA
                    </button>
                  )}
                </div>
                <div className="flex justify-between border-t border-sand-border pt-3 font-display text-lg font-bold text-ink">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-sand-border bg-white p-4">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-verified-bg text-xs font-bold text-oliva">
                  Pix
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold">Pagar com Pix</span>
                  <span className="text-xs text-muted-2">Dinheiro e cartão na entrega também</span>
                </div>
                <span className="text-xs font-semibold text-terracota">trocar</span>
              </div>

              <button
                type="button"
                disabled={enviando}
                onClick={finalizarPedido}
                className="rounded-2xl bg-terracota py-4.25 text-center text-base font-bold text-white shadow-cta disabled:opacity-60"
              >
                {enviando ? 'Enviando...' : `Fazer pedido · ${formatPrice(total)}`}
              </button>
              <p className="m-0 text-center text-xs text-muted-2">Cada banca confirma o próprio grupo em até 10 min</p>
            </div>
          </>
        )}
      </div>
    </Screen>
  )
}
