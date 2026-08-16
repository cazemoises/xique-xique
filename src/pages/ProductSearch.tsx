import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { LoadingState } from '../components/LoadingState'
import { BottomSheet } from '../components/BottomSheet'
import { useAsync } from '../hooks/useAsync'
import { buscarProdutos } from '../services/produtos'
import { formatPrice } from '../lib/formatPrice'
import type { OfertaProduto } from '../domain/produto'

const TAMANHOS_DESKTOP = ['P', 'M', 'G']
const PRECO_MAX_SLIDER = 200

export function ProductSearch() {
  const [query, setQuery] = useState('vestido de festa')
  const [mesmaFeiraOnly, setMesmaFeiraOnly] = useState(false)
  const [tamanhoFiltro, setTamanhoFiltro] = useState<string | null>(null)
  const [precoMax, setPrecoMax] = useState(PRECO_MAX_SLIDER)
  const [ordenarPor, setOrdenarPor] = useState<'menor-preco' | 'maior-preco'>('menor-preco')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const { data: ofertas, loading: ofertasLoading } = useAsync(() => buscarProdutos({ q: query }), [query])

  const ofertasFiltradas = useMemo(() => {
    const filtradas = (ofertas ?? [])
      .filter((o) => !tamanhoFiltro || o.produto.tamanhos.includes(tamanhoFiltro))
      .filter((o) => o.produto.preco <= precoMax)
    return [...filtradas].sort((a, b) =>
      ordenarPor === 'menor-preco' ? a.produto.preco - b.produto.preco : b.produto.preco - a.produto.preco,
    )
  }, [ofertas, tamanhoFiltro, precoMax, ordenarPor])

  const poloDoMaisBarato = ofertasFiltradas[0]?.poloId
  const mesmaFeira = useMemo(
    () => ofertasFiltradas.filter((o) => o.poloId === poloDoMaisBarato),
    [ofertasFiltradas, poloDoMaisBarato],
  )
  const outrasFeiras = useMemo(
    () => ofertasFiltradas.filter((o) => o.poloId !== poloDoMaisBarato),
    [ofertasFiltradas, poloDoMaisBarato],
  )
  const bancasEnvolvidas = new Set(ofertasFiltradas.map((o) => o.banca.id)).size

  return (
    <Screen variant="wide">
      <TopNav active="buscar" />

      <div className="bg-ink px-4 pb-3 pt-7.5 md:px-10 lg:hidden">
        <div className="flex items-center gap-2.5 rounded-2xl bg-ink-2 px-3.5 py-2.75 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ocre md:max-w-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9B7A8" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-placeholder"
            placeholder="Buscar peça"
          />
        </div>
        <div className="mt-2.75 flex flex-wrap gap-1.75">
          {tamanhoFiltro && (
            <button
              type="button"
              onClick={() => setTamanhoFiltro(null)}
              className="rounded-full bg-ocre px-3 py-2 text-xs font-semibold text-ink transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink"
            >
              Tam. {tamanhoFiltro} ×
            </button>
          )}
          {precoMax < PRECO_MAX_SLIDER && (
            <button
              type="button"
              onClick={() => setPrecoMax(PRECO_MAX_SLIDER)}
              className="rounded-full bg-ink-2 px-3 py-2 text-xs font-medium text-sand-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink"
            >
              Até {formatPrice(precoMax)} ×
            </button>
          )}
          <button
            type="button"
            onClick={() => setMesmaFeiraOnly((v) => !v)}
            className={`flex items-center gap-1.25 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink ${
              mesmaFeiraOnly ? 'bg-ocre text-ink hover:brightness-95' : 'bg-ink-2 text-sand-2 hover:bg-white/10'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l2-5h14l2 5" />
              <path d="M4 9h16v11H4z" />
            </svg>
            Mesma feira
          </button>
          <button
            type="button"
            onClick={() => setFiltrosAbertos(true)}
            className="rounded-full bg-ink-2 px-3 py-2 text-xs font-medium text-sand-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink"
          >
            Filtros
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between px-4 pb-1 pt-3.5 md:px-10 lg:hidden">
        <span className="text-xs text-muted-2">
          <strong className="font-bold text-ink">
            {mesmaFeiraOnly
              ? `${mesmaFeira.length} ofertas · mesma feira`
              : `${ofertasFiltradas.length} ofertas de ${bancasEnvolvidas} bancas`}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => setOrdenarPor((atual) => (atual === 'menor-preco' ? 'maior-preco' : 'menor-preco'))}
          className="rounded-sm text-xs font-semibold text-terracota transition-colors hover:text-barro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
        >
          {ordenarPor === 'menor-preco' ? 'Menor preço ▾' : 'Maior preço ▾'}
        </button>
      </div>

      <div className="flex-1 px-4 pt-2 md:px-10 lg:hidden">
        {ofertasLoading && !ofertas ? (
          <LoadingState label="Buscando ofertas…" />
        ) : ofertas && ofertas.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-2">Nenhuma oferta encontrada para “{query}”.</p>
        ) : (
          <>
            {mesmaFeira.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-0.5">
                  <span className="rounded-full bg-oliva px-2 py-1.25 text-2xs font-bold tracking-wide text-white">
                    MESMA FEIRA · 1 ENTREGA
                  </span>
                  <span className="text-xs text-muted-2">{mesmaFeira[0]?.poloNome}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {mesmaFeira.map((oferta) => (
                    <OfertaCard key={oferta.produto.id} oferta={oferta} />
                  ))}
                </div>
              </>
            )}

            {!mesmaFeiraOnly && outrasFeiras.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-0.5 pt-2.5">
                  <span className="rounded-full bg-sand-chip px-2 py-1.25 text-2xs font-bold tracking-wide text-muted-3">
                    OUTRAS FEIRAS
                  </span>
                  <span className="text-xs text-muted-2">gera entrega separada</span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {outrasFeiras.map((oferta) => (
                    <OfertaCard key={oferta.produto.id} oferta={oferta} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        <div className="h-24" />
      </div>

      <div className="hidden bg-ink lg:flex">
        <div className="flex items-center gap-3.5 px-12 py-5.5">
          <div className="flex flex-1 max-w-130 items-center gap-2.5 rounded-2xl bg-ink-2 px-4 py-3.25 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ocre">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9B7A8" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-placeholder"
              placeholder="Buscar peça"
            />
          </div>
          <span className="text-sm text-sand-2">
            <strong className="font-bold text-white">
              {mesmaFeiraOnly
                ? `${mesmaFeira.length} ofertas · mesma feira`
                : `${ofertasFiltradas.length} ofertas de ${bancasEnvolvidas} bancas`}
            </strong>
          </span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setOrdenarPor((atual) => (atual === 'menor-preco' ? 'maior-preco' : 'menor-preco'))}
            className="rounded-full bg-ink-2 px-3.5 py-2.5 text-sm font-semibold text-sand-chip transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink"
          >
            {ordenarPor === 'menor-preco' ? 'Menor preço ▾' : 'Maior preço ▾'}
          </button>
        </div>
      </div>

      <div className="hidden bg-ink lg:flex">
        <aside className="flex w-70 flex-none flex-col gap-6.5 border-r border-ink-2 p-8">
          <div>
            <p className="mb-3 text-sm font-bold text-sand-chip">Tamanho</p>
            <div className="flex flex-wrap gap-1.75">
              {TAMANHOS_DESKTOP.map((tamanho) => (
                <button
                  key={tamanho}
                  type="button"
                  onClick={() => setTamanhoFiltro((atual) => (atual === tamanho ? null : tamanho))}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink ${
                    tamanhoFiltro === tamanho ? 'bg-ocre text-ink hover:brightness-95' : 'bg-ink-2 text-sand-2 hover:bg-white/10'
                  }`}
                >
                  {tamanho}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-sand-chip">Preço até</p>
            <input
              type="range"
              min={0}
              max={PRECO_MAX_SLIDER}
              step={10}
              value={precoMax}
              onChange={(e) => setPrecoMax(Number(e.target.value))}
              className="w-full accent-ocre focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            />
            <p className="mt-2 text-xs text-sand-2">
              {precoMax >= PRECO_MAX_SLIDER ? 'Sem limite de preço' : `Até ${formatPrice(precoMax)}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMesmaFeiraOnly((v) => !v)}
            className={`flex items-center gap-2.25 rounded-xl px-3.25 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-1 focus-visible:ring-offset-ink ${
              mesmaFeiraOnly ? 'bg-ocre hover:brightness-95' : 'bg-ink-2 hover:bg-white/10'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={mesmaFeiraOnly ? '#241A16' : '#E3D6CA'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l2-5h14l2 5" />
              <path d="M4 9h16v11H4z" />
            </svg>
            <div className="flex flex-col">
              <span className={`text-sm font-semibold leading-tight ${mesmaFeiraOnly ? 'text-ink' : 'text-sand-2'}`}>
                Mesma feira
              </span>
              <span className={`text-xs leading-tight opacity-80 ${mesmaFeiraOnly ? 'text-ink' : 'text-sand-2'}`}>
                Uma entrega só
              </span>
            </div>
          </button>

          <div>
            <p className="mb-3 text-sm font-bold text-sand-chip">Distância</p>
            <div className="flex flex-col gap-2.25 text-sm text-sand-2 opacity-40">
              <label className="flex items-center gap-2.25" title="Em breve">
                <input type="checkbox" disabled />
                Até 5 km <span className="text-2xs">· em breve</span>
              </label>
              <label className="flex items-center gap-2.25" title="Em breve">
                <input type="checkbox" disabled />
                Até 10 km <span className="text-2xs">· em breve</span>
              </label>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-9">
          {ofertasLoading && !ofertas ? (
            <LoadingState label="Buscando ofertas…" tone="dark" />
          ) : ofertas && ofertas.length === 0 ? (
            <p className="py-16 text-center text-sm text-sand-2">Nenhuma oferta encontrada para “{query}”.</p>
          ) : (
            <>
              {mesmaFeira.length > 0 && (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-oliva px-2.25 py-1.5 text-xs font-bold tracking-wide text-white">
                      MESMA FEIRA · 1 ENTREGA
                    </span>
                    <span className="text-sm text-sand-2">{mesmaFeira[0]?.poloNome}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4.5">
                    {mesmaFeira.map((oferta) => (
                      <OfertaCardDesktop key={oferta.produto.id} oferta={oferta} />
                    ))}
                  </div>
                </>
              )}

              {!mesmaFeiraOnly && outrasFeiras.length > 0 && (
                <>
                  <div className="mt-6.5 flex items-center gap-2.5">
                    <span className="rounded-full bg-ink-2 px-2.25 py-1.5 text-xs font-bold tracking-wide text-sand-2">
                      OUTRAS FEIRAS
                    </span>
                    <span className="text-sm text-sand-2">gera entrega separada</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4.5">
                    {outrasFeiras.map((oferta) => (
                      <OfertaCardDesktop key={oferta.produto.id} oferta={oferta} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {filtrosAbertos && (
        <BottomSheet
          onClose={() => setFiltrosAbertos(false)}
          title="Filtros"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          }
        >
          <div>
            <p className="mb-2.5 text-sm font-bold">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {TAMANHOS_DESKTOP.map((tamanho) => (
                <button
                  key={tamanho}
                  type="button"
                  onClick={() => setTamanhoFiltro((atual) => (atual === tamanho ? null : tamanho))}
                  className={`rounded-lg px-3.5 py-2.25 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
                    tamanhoFiltro === tamanho
                      ? 'bg-ink text-white'
                      : 'border-[1.5px] border-sand-border bg-white text-ink hover:border-ink'
                  }`}
                >
                  {tamanho}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-1">
            <p className="mb-2.5 text-sm font-bold">Preço até</p>
            <input
              type="range"
              min={0}
              max={PRECO_MAX_SLIDER}
              step={10}
              value={precoMax}
              onChange={(e) => setPrecoMax(Number(e.target.value))}
              className="w-full accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
            />
            <p className="mt-2 text-xs text-muted-2">
              {precoMax >= PRECO_MAX_SLIDER ? 'Sem limite de preço' : `Até ${formatPrice(precoMax)}`}
            </p>
          </div>
        </BottomSheet>
      )}
    </Screen>
  )
}

function OfertaCard({ oferta }: { oferta: OfertaProduto }) {
  return (
    <Link
      to={`/produto/${oferta.produto.id}`}
      className="flex gap-3 rounded-2xl border border-sand-border bg-white p-3 transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0"
    >
      <PlaceholderPhoto
        label="foto peça"
        src={oferta.produto.fotos[0]}
        className="h-26 w-21.5 flex-none rounded-2xl sm:h-40 sm:w-full sm:rounded-none"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.25 sm:p-3">
        {oferta.badge && (
          <span className="self-start rounded-full bg-ocre px-1.75 py-1 text-2xs font-bold tracking-wide text-ink">
            {oferta.badge === 'MENOR_PRECO' ? 'MENOR PREÇO' : 'MESMA ENTREGA'}
          </span>
        )}
        <span className="text-sm leading-snug">{oferta.produto.nome}</span>
        <div className="flex items-baseline gap-1.75">
          <span className="font-display text-lg font-bold text-ink">{formatPrice(oferta.produto.preco)}</span>
          {oferta.produto.precoAntigo && (
            <span className="text-xs text-faded line-through">{formatPrice(oferta.produto.precoAntigo)}</span>
          )}
        </div>
        <span className="text-xs text-muted-2">
          {oferta.banca.nome} · ★ {oferta.banca.rating.toFixed(1).replace('.', ',')}
        </span>
        <span className="text-xs font-medium text-oliva">{oferta.entregaLabel}</span>
        <span className="text-2xs text-muted-2">Tamanhos: {oferta.produto.tamanhos.join(', ')}</span>
      </div>
    </Link>
  )
}

function OfertaCardDesktop({ oferta }: { oferta: OfertaProduto }) {
  return (
    <Link
      to={`/produto/${oferta.produto.id}`}
      className="flex flex-col gap-2 rounded-2xl bg-ink-2 p-3.5 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <PlaceholderPhoto label="foto peça" src={oferta.produto.fotos[0]} className="h-47.5 w-full rounded-xl" />
      {oferta.badge && (
        <span className="self-start rounded-full bg-ocre px-2 py-1 text-2xs font-bold tracking-wide text-ink">
          {oferta.badge === 'MENOR_PRECO' ? 'MENOR PREÇO' : 'MESMA ENTREGA'}
        </span>
      )}
      <span className="text-sm leading-snug text-sand-chip">{oferta.produto.nome}</span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-xl font-bold text-white">{formatPrice(oferta.produto.preco)}</span>
        {oferta.produto.precoAntigo && (
          <span className="text-xs text-muted-2 line-through">{formatPrice(oferta.produto.precoAntigo)}</span>
        )}
      </div>
      <span className="text-xs text-sand-2">
        {oferta.banca.nome} · ★ {oferta.banca.rating.toFixed(1).replace('.', ',')}
      </span>
      <span className="text-xs font-medium text-oliva">{oferta.entregaLabel}</span>
    </Link>
  )
}
