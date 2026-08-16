import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { LoadingState } from '../components/LoadingState'
import { useAsync } from '../hooks/useAsync'
import { getProduto } from '../services/produtos'
import { getBanca } from '../services/bancas'
import { formatPrice } from '../lib/formatPrice'
import { useCart } from '../state/CartContext'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: produto, loading: produtoLoading } = useAsync(() => getProduto(id!), [id])
  const { data: banca } = useAsync(() => (produto ? getBanca(produto.bancaId) : Promise.resolve(null)), [produto])
  const [tamanho, setTamanho] = useState<string | null>(null)
  const [quantidade, setQuantidade] = useState(1)
  const { adicionarItem } = useCart()
  const navigate = useNavigate()

  if (produtoLoading && !produto) {
    return (
      <Screen>
        <TopNav backTo="/" backLabel="Voltar" showCart />
        <LoadingState label="Carregando peça…" />
      </Screen>
    )
  }

  if (!produto || !banca) return null

  const tamanhoAtual = tamanho ?? produto.tamanhos[Math.floor(produto.tamanhos.length / 2)]
  const medida = produto.medidas?.[tamanhoAtual]

  function adicionarAoCarrinho() {
    if (!produto || !banca) return
    adicionarItem({
      produtoId: produto.id,
      bancaId: banca.id,
      nome: produto.nome,
      tamanho: tamanhoAtual,
      quantidade,
      precoUnitario: produto.preco,
    })
    navigate('/sacola')
  }

  return (
    <Screen>
      <TopNav backTo={`/banca/${banca.id}`} backLabel="Voltar à banca" showCart />

      <div className="relative lg:hidden">
        <PlaceholderPhoto label="foto do produto 3:4" src={produto.fotos[0]} className="h-75 w-full" />
        <Link
          to={`/banca/${banca.id}`}
          aria-label="Voltar"
          className="absolute left-4 top-14.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/92 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex-1 px-5 pt-4.5 lg:hidden">
        {produto.precoAntigo && (
          <span className="rounded-full bg-ocre px-1.75 py-1 text-2xs font-bold tracking-wide text-ink">
            MENOR PREÇO DA BUSCA
          </span>
        )}
        <h2 className="mb-0 mt-2.5 font-display text-2xl font-bold leading-snug">{produto.nome}</h2>
        <div className="mt-2 flex items-baseline gap-2.25">
          <span className="font-display text-3xl font-bold text-terracota">{formatPrice(produto.preco)}</span>
          {produto.precoAntigo && (
            <span className="text-sm text-faded line-through">{formatPrice(produto.precoAntigo)}</span>
          )}
          <span className="text-xs font-semibold text-oliva">3× de {formatPrice(produto.preco / 3)}</span>
        </div>

        <Link
          to={`/banca/${banca.id}`}
          className="mt-4.5 flex items-center gap-2.75 rounded-2xl border border-sand-border bg-white p-3 transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
        >
          <PlaceholderPhoto label="" src={banca.fotoLogoUrl} className="h-11 w-11 rounded-xl" />
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-base font-bold leading-tight">{banca.nome}</span>
            <span className="text-xs text-muted-2">
              ★ {banca.rating.toFixed(1).replace('.', ',')} · {banca.distanciaKm} km
              {banca.corredor && ` · ${banca.corredor}`}
            </span>
          </div>
          <span className="rounded-full bg-verified-bg px-2.75 py-2 text-xs font-semibold text-oliva">Ver banca</span>
        </Link>

        <p className="mb-2.25 mt-5 text-base font-bold">Tamanho</p>
        <div className="flex gap-2.25">
          {produto.tamanhos.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTamanho(s)}
              className={`min-w-12 rounded-xl border-[1.5px] py-2.75 text-center text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
                s === tamanhoAtual ? 'border-ink bg-ink text-white hover:bg-ink-2' : 'border-sand-border bg-white text-ink hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {medida && <p className="mb-0 mt-2.25 text-xs leading-snug text-muted-2">Tamanho {tamanhoAtual} — {medida}.</p>}

        <div className="mt-4.5 flex flex-col gap-2.25 rounded-2xl border border-sand-border bg-white p-3.5">
          <div className="flex items-center gap-2.5">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2" strokeLinecap="round">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
            <span className="text-sm font-medium leading-snug">
              Chega hoje, entre 17h e 19h · <strong>{banca.taxaEntregaLabel}</strong>
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
              <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-sm font-medium leading-snug">
              Troca em até 48h por defeito de fabricação ou erro de medida · solicite pelo app
            </span>
          </div>
        </div>
        <div className="h-30" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] items-center gap-3 border-t border-sand-border bg-white px-4.5 py-3.5 pb-7.5 md:sticky md:inset-x-auto lg:hidden">
        <div className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-sand-border px-3.25 py-2.75 text-sm font-semibold">
          <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} className="text-faded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 rounded-sm px-1">
            −
          </button>
          <span>{quantidade}</span>
          <button type="button" onClick={() => setQuantidade((q) => q + 1)} className="text-terracota transition-colors hover:text-barro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 rounded-sm px-1">
            +
          </button>
        </div>
        <button
          type="button"
          onClick={adicionarAoCarrinho}
          className="flex-1 rounded-2xl bg-terracota py-3.75 text-center text-lg font-bold text-white shadow-cta transition hover:bg-barro active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota"
        >
          Adicionar · {formatPrice(produto.preco * quantidade)}
        </button>
      </div>

      <div className="hidden grid-cols-[1fr_28.75rem] gap-12 px-12 py-10 lg:grid">
        <PlaceholderPhoto label="foto do produto" src={produto.fotos[0]} className="h-130 w-full rounded-3xl" />

        <div className="flex flex-col gap-4.5">
          {produto.precoAntigo && (
            <span className="self-start rounded-full bg-ocre px-2.25 py-1.25 text-xs font-bold tracking-wide text-ink">
              MENOR PREÇO DA BUSCA
            </span>
          )}
          <h2 className="m-0 font-display text-3xl font-bold leading-snug">{produto.nome}</h2>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-4xl font-bold text-terracota">{formatPrice(produto.preco)}</span>
            {produto.precoAntigo && (
              <span className="text-sm text-faded line-through">{formatPrice(produto.precoAntigo)}</span>
            )}
            <span className="text-sm font-semibold text-oliva">3× de {formatPrice(produto.preco / 3)}</span>
          </div>

          <Link
            to={`/banca/${banca.id}`}
            className="flex items-center gap-3 rounded-2xl border border-sand-border bg-white p-3.5 transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
          >
            <PlaceholderPhoto label="" src={banca.fotoLogoUrl} className="h-12 w-12 rounded-xl" />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-base font-bold leading-tight">{banca.nome}</span>
              <span className="text-sm text-muted-2">
                ★ {banca.rating.toFixed(1).replace('.', ',')} · {banca.distanciaKm} km
                {banca.corredor && ` · ${banca.corredor}`}
              </span>
            </div>
            <span className="rounded-full bg-verified-bg px-3 py-2 text-xs font-semibold text-oliva">Ver banca</span>
          </Link>

          <div>
            <p className="mb-2.25 text-base font-bold">Tamanho</p>
            <div className="flex gap-2.25">
              {produto.tamanhos.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTamanho(s)}
                  className={`min-w-13 rounded-xl border-[1.5px] py-2.75 text-center text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
                    s === tamanhoAtual ? 'border-ink bg-ink text-white hover:bg-ink-2' : 'border-sand-border bg-white text-ink hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {medida && <p className="mb-0 mt-2.25 text-xs leading-snug text-muted-2">Tamanho {tamanhoAtual} — {medida}.</p>}
          </div>

          <div className="flex flex-col gap-2.25 rounded-2xl border border-sand-border bg-white p-4">
            <div className="flex items-center gap-2.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2" strokeLinecap="round">
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <span className="text-sm font-medium leading-snug">
                Chega hoje, entre 17h e 19h · <strong>{banca.taxaEntregaLabel}</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
                <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-sm font-medium leading-snug">
                Troca em até 48h por defeito de fabricação ou erro de medida · solicite pelo app
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-4 rounded-2xl border-[1.5px] border-sand-border px-4 py-3 text-base font-semibold">
              <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} className="text-faded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 rounded-sm px-1">
                −
              </button>
              <span>{quantidade}</span>
              <button type="button" onClick={() => setQuantidade((q) => q + 1)} className="text-terracota transition-colors hover:text-barro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 rounded-sm px-1">
                +
              </button>
            </div>
            <button
              type="button"
              onClick={adicionarAoCarrinho}
              className="flex-1 rounded-2xl bg-terracota py-4 text-center text-lg font-bold text-white shadow-cta transition hover:bg-barro active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota"
            >
              Adicionar · {formatPrice(produto.preco * quantidade)}
            </button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
