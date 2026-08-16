import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { VerifiedBadge } from '../components/VerifiedBadge'
import { VerifiedInfoSheet } from '../components/VerifiedInfoSheet'
import { LoadingState } from '../components/LoadingState'
import { useAsync } from '../hooks/useAsync'
import { getBancas } from '../services/bancas'
import { getPolos } from '../services/polos'
import { formatEta } from '../lib/formatEta'

export function VendorsNearby() {
  const [searchParams, setSearchParams] = useSearchParams()
  const poloIdFiltro = searchParams.get('polo') ?? undefined
  const { data: bancas, loading: bancasLoading } = useAsync(() => getBancas(poloIdFiltro), [poloIdFiltro])
  const { data: polos } = useAsync(() => getPolos(), [])
  const poloAtivo = polos?.find((p) => p.id === poloIdFiltro)
  const [verificadaAberta, setVerificadaAberta] = useState(false)
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([])
  const [entregaGratisOnly, setEntregaGratisOnly] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<'perto' | 'avaliacao'>('perto')

  const categoriasDisponiveis = useMemo(
    () => Array.from(new Set(bancas?.flatMap((b) => b.categorias) ?? [])).sort(),
    [bancas],
  )

  function toggleCategoria(categoria: string) {
    setCategoriasFiltro((atual) =>
      atual.includes(categoria) ? atual.filter((c) => c !== categoria) : [...atual, categoria],
    )
  }

  const bancasFiltradas = useMemo(() => {
    if (!bancas) return []
    let resultado = bancas
    if (categoriasFiltro.length > 0) {
      resultado = resultado.filter((b) => b.categorias.some((c) => categoriasFiltro.includes(c)))
    }
    if (entregaGratisOnly) {
      resultado = resultado.filter((b) => b.taxaEntrega === 0)
    }
    return [...resultado].sort((a, b) =>
      ordenarPor === 'avaliacao' ? b.rating - a.rating : a.distanciaKm - b.distanciaKm,
    )
  }, [bancas, categoriasFiltro, entregaGratisOnly, ordenarPor])

  return (
    <Screen variant="wide">
      <TopNav active="bancas" showSearch showLocation />

      <div className="relative border-b border-sand-border bg-white px-5 pt-8 pb-3.5 md:px-10 lg:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Voltar"
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 rounded-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <span className="font-display text-lg font-bold">Bancas perto de você</span>
        </div>
        {poloAtivo && (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-medium text-white transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
          >
            Filtrando por: {poloAtivo.nome} <span className="text-sand-2">×</span>
          </button>
        )}
        <div className="mt-3.5 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setOrdenarPor((atual) => (atual === 'perto' ? 'avaliacao' : 'perto'))}
            className="flex-none rounded-full px-3 py-2 text-xs font-medium bg-ink text-white font-semibold transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
          >
            {ordenarPor === 'perto' ? 'Mais perto ▾' : 'Melhor avaliada ▾'}
          </button>
          {categoriasDisponiveis.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => toggleCategoria(categoria)}
              className={`flex-none rounded-full px-3 py-2 text-xs font-medium transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
                categoriasFiltro.includes(categoria) ? 'bg-ink text-white font-semibold' : 'bg-sand-chip text-muted-3'
              }`}
            >
              {categoria}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setEntregaGratisOnly((v) => !v)}
            className={`flex-none rounded-full px-3 py-2 text-xs font-medium transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
              entregaGratisOnly ? 'bg-ink text-white font-semibold' : 'bg-sand-chip text-muted-3'
            }`}
          >
            Entrega grátis
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-3.5 pb-24 md:px-10 lg:hidden">
        {bancasLoading && !bancas ? (
          <LoadingState label="Carregando bancas…" />
        ) : bancas && bancasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sand-border bg-white px-6 py-12 text-center">
            <span className="font-display text-base font-bold text-ink">Nenhuma banca encontrada</span>
            <span className="text-sm text-muted-2">Tente remover alguns filtros.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
            {bancasFiltradas.map((banca) => (
              <Link
                key={banca.id}
                to={`/banca/${banca.id}`}
                className="flex items-center gap-3 rounded-2xl border border-sand-border bg-white p-3 transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
              >
                <PlaceholderPhoto label="logo banca" src={banca.fotoLogoUrl} className="h-18 w-18 flex-none rounded-2xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold leading-tight">{banca.nome}</span>
                    {banca.verificada && <VerifiedBadge onClick={() => setVerificadaAberta(true)} />}
                  </div>
                  <span className="text-xs leading-snug text-muted-2">{banca.categorias.join(' · ')}</span>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-3">
                    <span className="text-terracota">★ {banca.rating.toFixed(1).replace('.', ',')}</span>
                    <span className="text-sand-border">·</span>
                    <span>{banca.distanciaKm} km</span>
                    <span className="text-sand-border">·</span>
                    <span>{formatEta(banca.etaMinutos)}</span>
                  </div>
                  <span className="text-xs font-medium text-muted">{banca.taxaEntregaLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="my-1.5 mb-4.5 flex items-center gap-3 rounded-2xl bg-oliva p-4 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="2" strokeLinecap="round">
            <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="font-display text-base font-bold leading-tight">Ver bancas no mapa da feira</span>
            <span className="text-xs opacity-80">Parque 18 de Maio · corredores A–J</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex">
        <aside className="flex w-70 flex-none flex-col gap-6.5 border-r border-sand-border p-8">
          <div>
            <p className="mb-3 text-sm font-bold">Ordenar por</p>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value as 'perto' | 'avaliacao')}
              className="w-full rounded-xl bg-ink px-3.25 py-2.75 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
            >
              <option value="perto">Mais perto</option>
              <option value="avaliacao">Melhor avaliada</option>
            </select>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Categoria</p>
            <div className="flex flex-col gap-2.25 text-sm text-muted-3">
              {categoriasDisponiveis.map((categoria) => (
                <label key={categoria} className="flex items-center gap-2.25">
                  <input
                    type="checkbox"
                    checked={categoriasFiltro.includes(categoria)}
                    onChange={() => toggleCategoria(categoria)}
                    className="accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                  />
                  {categoria}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Entrega</p>
            <div className="flex flex-col gap-2.25 text-sm text-muted-3">
              <label className="flex items-center gap-2.25">
                <input
                  type="checkbox"
                  checked={entregaGratisOnly}
                  onChange={() => setEntregaGratisOnly((v) => !v)}
                  className="accent-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                />
                Entrega grátis
              </label>
              <label className="flex items-center gap-2.25 opacity-40" title="Em breve">
                <input type="checkbox" disabled />
                Entrega hoje <span className="text-2xs">· em breve</span>
              </label>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Pagamento</p>
            <div className="flex flex-col gap-2.25 text-sm text-muted-3 opacity-40">
              <label className="flex items-center gap-2.25" title="Em breve">
                <input type="checkbox" disabled />
                Pix <span className="text-2xs">· em breve</span>
              </label>
              <label className="flex items-center gap-2.25" title="Em breve">
                <input type="checkbox" disabled />
                Cartão <span className="text-2xs">· em breve</span>
              </label>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 rounded-2xl bg-oliva p-4 text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="2" strokeLinecap="round">
              <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            <span className="font-display text-sm font-bold leading-tight">Ver no mapa da feira</span>
            <span className="text-xs opacity-80">Parque 18 de Maio · corredores A–J</span>
          </div>
        </aside>

        <main className="flex-1 p-10">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="flex items-center gap-3">
              <h2 className="m-0 font-display text-2xl font-bold">Bancas perto de você</h2>
              {poloAtivo && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
                >
                  Filtrando por: {poloAtivo.nome} <span className="text-sand-2">×</span>
                </button>
              )}
            </div>
            <span className="text-sm text-muted-2">{bancasFiltradas.length} bancas encontradas</span>
          </div>
          {bancasLoading && !bancas ? (
            <LoadingState label="Carregando bancas…" />
          ) : bancas && bancasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sand-border bg-white px-6 py-16 text-center">
              <span className="font-display text-base font-bold text-ink">Nenhuma banca encontrada</span>
              <span className="text-sm text-muted-2">Tente remover alguns filtros.</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4.5">
              {bancasFiltradas.map((banca) => (
                <Link
                  key={banca.id}
                  to={`/banca/${banca.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-sand-border bg-white transition hover:border-terracota focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
                >
                  <PlaceholderPhoto label="logo banca" src={banca.fotoLogoUrl} className="h-32.5 w-full" />
                  <div className="flex flex-col gap-1.5 px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-bold leading-tight">{banca.nome}</span>
                      {banca.verificada && <VerifiedBadge onClick={() => setVerificadaAberta(true)} />}
                    </div>
                    <span className="text-sm text-muted-2">{banca.categorias.join(' · ')}</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-3">
                      <span className="text-terracota">★ {banca.rating.toFixed(1).replace('.', ',')}</span>
                      <span className="text-sand-border">·</span>
                      <span>{banca.distanciaKm} km</span>
                      <span className="text-sand-border">·</span>
                      <span>{formatEta(banca.etaMinutos)}</span>
                    </div>
                    <span className="text-sm font-medium text-muted">{banca.taxaEntregaLabel}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {verificadaAberta && <VerifiedInfoSheet onClose={() => setVerificadaAberta(false)} />}
    </Screen>
  )
}
