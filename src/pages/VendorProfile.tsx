import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { VerifiedBadge } from '../components/VerifiedBadge'
import { VerifiedInfoSheet } from '../components/VerifiedInfoSheet'
import { LoadingState } from '../components/LoadingState'
import { useAsync } from '../hooks/useAsync'
import { getBanca, getCatalogoDaBanca } from '../services/bancas'
import { formatPrice } from '../lib/formatPrice'
import { formatEta } from '../lib/formatEta'
import { useCart } from '../state/CartContext'

const abas = ['Destaques', 'Vestidos', 'Blusas', 'Saias']

type FaixaPreco = 'ate-60' | '60-120' | 'acima-120'

function naFaixa(preco: number, faixa: FaixaPreco): boolean {
  if (faixa === 'ate-60') return preco <= 60
  if (faixa === '60-120') return preco > 60 && preco <= 120
  return preco > 120
}

export function VendorProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: banca, loading: bancaLoading } = useAsync(() => getBanca(id!), [id])
  const { data: catalogo } = useAsync(() => getCatalogoDaBanca(id!), [id])
  const [verificadaAberta, setVerificadaAberta] = useState(false)
  const [tamanhoFiltro, setTamanhoFiltro] = useState<string[]>([])
  const [faixasPreco, setFaixasPreco] = useState<FaixaPreco[]>([])
  const [favoritada, setFavoritada] = useState(false)
  const { itens } = useCart()

  const itensDestaBanca = itens.filter((item) => item.bancaId === id)
  const totalNaSacola = itensDestaBanca.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)

  const tamanhosDisponiveis = useMemo(
    () => Array.from(new Set(catalogo?.flatMap((p) => p.tamanhos) ?? [])),
    [catalogo],
  )

  const catalogoFiltrado = useMemo(() => {
    if (!catalogo) return []
    return catalogo
      .filter((p) => tamanhoFiltro.length === 0 || p.tamanhos.some((t) => tamanhoFiltro.includes(t)))
      .filter((p) => faixasPreco.length === 0 || faixasPreco.some((f) => naFaixa(p.preco, f)))
  }, [catalogo, tamanhoFiltro, faixasPreco])

  function toggleTamanho(tamanho: string) {
    setTamanhoFiltro((atual) => (atual.includes(tamanho) ? atual.filter((t) => t !== tamanho) : [...atual, tamanho]))
  }

  function toggleFaixa(faixa: FaixaPreco) {
    setFaixasPreco((atual) => (atual.includes(faixa) ? atual.filter((f) => f !== faixa) : [...atual, faixa]))
  }

  if (!banca) {
    if (bancaLoading) {
      return (
        <Screen variant="wide">
          <TopNav backTo="/bancas" backLabel="Voltar às bancas" showSearch showCart />
          <LoadingState label="Carregando banca…" />
        </Screen>
      )
    }
    return null
  }

  return (
    <Screen variant="wide">
      <TopNav backTo="/bancas" backLabel="Voltar às bancas" showSearch showCart />

      <div className="relative">
        <PlaceholderPhoto label="foto da banca (capa)" src={banca.fotoCapaUrl} className="h-37.5 w-full md:h-56" />
        <Link
          to="/bancas"
          aria-label="Voltar"
          className="absolute left-4 top-14.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/92 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 lg:hidden"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <button
          type="button"
          aria-label={favoritada ? 'Remover dos favoritos' : 'Favoritar'}
          onClick={() => setFavoritada((v) => !v)}
          className="absolute right-4 top-14.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/92 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 lg:hidden"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={favoritada ? '#8C4A3A' : 'none'} stroke="#8C4A3A" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 20s-7-4.6-7-9.3A4.1 4.1 0 0112 8a4.1 4.1 0 017 2.7C19 15.4 12 20 12 20z" />
          </svg>
        </button>
      </div>

      <div className="border-b border-sand-border bg-white px-4.5 pb-3.5 pt-3.5 md:px-10 lg:px-12">
        <div className="flex items-center gap-1.5">
          <h2 className="m-0 font-display text-2xl font-bold lg:text-3xl">{banca.nome}</h2>
          {banca.verificada && <VerifiedBadge onClick={() => setVerificadaAberta(true)} />}
        </div>
        <p className="mt-1.5 mb-0 text-xs text-muted-2 lg:text-sm">
          {banca.categorias.join(', ')}
          {banca.corredor && ` · ${banca.corredor}`}
        </p>
        <div className="mt-2.5 flex gap-4 text-xs font-medium lg:text-sm">
          <span className="text-terracota">
            ★ {banca.rating.toFixed(1).replace('.', ',')} <span className="font-normal text-muted-2">(212)</span>
          </span>
          <span>{banca.distanciaKm} km</span>
          <span>Hoje, {formatEta(banca.etaMinutos)}</span>
          <span className="text-oliva">{banca.taxaEntregaLabel}</span>
        </div>
      </div>

      <div className="flex gap-4.5 border-b border-sand-border bg-white px-4.5 pt-3 text-sm font-semibold md:px-10 lg:px-12">
        {abas.map((aba, i) => (
          <span
            key={aba}
            className={`pb-2.5 ${i === 0 ? 'border-b-[2.5px] border-terracota' : 'text-faded'}`}
          >
            {aba}
          </span>
        ))}
      </div>

      <div className="flex-1 px-4 pt-4 md:px-10 lg:hidden">
        <p className="mb-2 text-xs text-muted-2">{catalogo?.length ?? 0} peças</p>
        <div className="grid grid-cols-2 gap-3 pb-44 md:grid-cols-3 md:gap-4">
          {catalogo?.map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-sand-border bg-white transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
            >
              <PlaceholderPhoto label="foto peça" src={produto.fotos[0]} className="h-29.5 w-full" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2.5">
                <span className="text-xs leading-snug">{produto.nome}</span>
                <span className="text-lg font-bold">{formatPrice(produto.preco)}</span>
                <span className="text-2xs text-muted-2">{produto.tamanhos.join(' · ')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {itensDestaBanca.length > 0 && (
        <Link
          to="/sacola"
          className="fixed inset-x-4 bottom-24 z-30 mx-auto flex max-w-[416px] items-center justify-between rounded-2xl bg-terracota px-4.5 py-3.5 text-white shadow-pill transition hover:bg-barro active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota lg:hidden"
        >
          <span className="text-base font-semibold">
            {itensDestaBanca.length} {itensDestaBanca.length === 1 ? 'peça' : 'peças'} na sacola
          </span>
          <span className="text-lg font-bold">Ver sacola · {formatPrice(totalNaSacola)}</span>
        </Link>
      )}

      <div className="hidden lg:flex">
        <aside className="flex w-65 flex-none flex-col gap-6 border-r border-sand-border p-7">
          <div>
            <p className="mb-3 text-sm font-bold">Tamanho</p>
            <div className="flex flex-wrap gap-1.75">
              {tamanhosDisponiveis.map((tamanho) => (
                <button
                  key={tamanho}
                  type="button"
                  onClick={() => toggleTamanho(tamanho)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
                    tamanhoFiltro.includes(tamanho)
                      ? 'bg-ink text-white hover:bg-ink-2'
                      : 'border-[1.5px] border-sand-border bg-white hover:border-terracota'
                  }`}
                >
                  {tamanho}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Faixa de preço</p>
            <div className="flex flex-col gap-2.25 text-sm text-muted-3">
              <label className="flex items-center gap-2.25">
                <input
                  type="checkbox"
                  checked={faixasPreco.includes('ate-60')}
                  onChange={() => toggleFaixa('ate-60')}
                  className="accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                />
                Até R$ 60
              </label>
              <label className="flex items-center gap-2.25">
                <input
                  type="checkbox"
                  checked={faixasPreco.includes('60-120')}
                  onChange={() => toggleFaixa('60-120')}
                  className="accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                />
                R$ 60 – R$ 120
              </label>
              <label className="flex items-center gap-2.25">
                <input
                  type="checkbox"
                  checked={faixasPreco.includes('acima-120')}
                  onChange={() => toggleFaixa('acima-120')}
                  className="accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                />
                Acima de R$ 120
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-sand-chip p-3.5 text-xs leading-relaxed text-muted-3">
            Troca em até 48h por defeito ou erro de medida, solicitada pelo app.
          </div>
        </aside>

        <main className="relative flex-1 p-9 pb-24">
          <p className="mb-3 text-sm text-muted-2">{catalogoFiltrado.length} peças</p>
          {catalogo && catalogoFiltrado.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-2">Nenhuma peça encontrada com esses filtros.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4.5">
              {catalogoFiltrado.map((produto) => (
                <Link
                  key={produto.id}
                  to={`/produto/${produto.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-sand-border bg-white transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
                >
                  <PlaceholderPhoto label="foto peça" src={produto.fotos[0]} className="h-42.5 w-full" />
                  <div className="flex flex-col gap-1 px-3.25 py-3.5">
                    <span className="text-sm leading-snug">{produto.nome}</span>
                    <span className="text-lg font-bold">{formatPrice(produto.preco)}</span>
                    <span className="text-xs text-muted-2">{produto.tamanhos.join(' · ')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {itensDestaBanca.length > 0 && (
            <Link
              to="/sacola"
              className="sticky bottom-6 ml-auto flex w-85 items-center justify-between rounded-2xl bg-terracota px-5 py-4 text-white shadow-pill transition hover:bg-barro active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota"
            >
              <span className="text-sm font-semibold">
                {itensDestaBanca.length} {itensDestaBanca.length === 1 ? 'peça' : 'peças'} na sacola
              </span>
              <span className="text-base font-bold">Ver sacola · {formatPrice(totalNaSacola)}</span>
            </Link>
          )}
        </main>
      </div>

      {verificadaAberta && <VerifiedInfoSheet onClose={() => setVerificadaAberta(false)} />}
    </Screen>
  )
}
