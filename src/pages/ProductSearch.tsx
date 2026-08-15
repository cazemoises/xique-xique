import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { useAsync } from '../hooks/useAsync'
import { buscarProdutos } from '../services/produtos'
import { formatPrice } from '../lib/formatPrice'
import type { OfertaProduto } from '../domain/produto'

export function ProductSearch() {
  const [query, setQuery] = useState('vestido de festa')
  const [mesmaFeiraOnly, setMesmaFeiraOnly] = useState(false)
  const { data: ofertas } = useAsync(() => buscarProdutos({ q: query }), [query])

  const poloDoMaisBarato = ofertas?.[0]?.poloId
  const mesmaFeira = useMemo(() => ofertas?.filter((o) => o.poloId === poloDoMaisBarato) ?? [], [ofertas, poloDoMaisBarato])
  const outrasFeiras = useMemo(() => ofertas?.filter((o) => o.poloId !== poloDoMaisBarato) ?? [], [ofertas, poloDoMaisBarato])
  const bancasEnvolvidas = new Set(ofertas?.map((o) => o.banca.id)).size

  return (
    <Screen variant="wide">
      <div className="bg-ink px-4 pb-3 pt-7.5 md:px-10">
        <div className="flex items-center gap-2.5 rounded-2xl bg-ink-2 px-3.5 py-2.75 md:max-w-md">
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
          <span className="rounded-full bg-ocre px-3 py-2 text-xs font-semibold text-ink">Tam. M ×</span>
          <span className="rounded-full bg-ink-2 px-3 py-2 text-xs font-medium text-sand-2">Até R$ 150</span>
          <button
            type="button"
            onClick={() => setMesmaFeiraOnly((v) => !v)}
            className={`flex items-center gap-1.25 rounded-full px-3 py-2 text-xs font-semibold ${
              mesmaFeiraOnly ? 'bg-ocre text-ink' : 'bg-ink-2 text-sand-2'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l2-5h14l2 5" />
              <path d="M4 9h16v11H4z" />
            </svg>
            Mesma feira
          </button>
          <span className="rounded-full bg-ink-2 px-3 py-2 text-xs font-medium text-sand-2">Filtros</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between px-4 pb-1 pt-3.5 md:px-10">
        <span className="text-xs text-muted-2">
          <strong className="font-bold text-ink">
            {mesmaFeiraOnly
              ? `${mesmaFeira.length} ofertas · mesma feira`
              : `${ofertas?.length ?? 0} ofertas de ${bancasEnvolvidas} bancas`}
          </strong>
        </span>
        <span className="text-xs font-semibold text-terracota">Menor preço ▾</span>
      </div>

      <div className="flex-1 px-4 pt-2 md:px-10">
        {mesmaFeira.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-0.5">
              <span className="rounded-full bg-oliva px-2 py-1.25 text-2xs font-bold tracking-wide text-white">
                MESMA FEIRA · 1 ENTREGA
              </span>
              <span className="text-xs text-muted-2">{mesmaFeira[0]?.poloNome}</span>
            </div>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {outrasFeiras.map((oferta) => (
                <OfertaCard key={oferta.produto.id} oferta={oferta} />
              ))}
            </div>
          </>
        )}
        <div className="h-24" />
      </div>
    </Screen>
  )
}

function OfertaCard({ oferta }: { oferta: OfertaProduto }) {
  return (
    <Link
      to={`/produto/${oferta.produto.id}`}
      className="flex gap-3 rounded-2xl border border-sand-border bg-white p-3 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0"
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
