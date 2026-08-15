import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { VerifiedBadge } from '../components/VerifiedBadge'
import { VerifiedInfoSheet } from '../components/VerifiedInfoSheet'
import { useAsync } from '../hooks/useAsync'
import { getBanca, getCatalogoDaBanca } from '../services/bancas'
import { formatPrice } from '../lib/formatPrice'
import { formatEta } from '../lib/formatEta'
import { useCart } from '../state/CartContext'

const abas = ['Destaques', 'Vestidos', 'Blusas', 'Saias']

export function VendorProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: banca } = useAsync(() => getBanca(id!), [id])
  const { data: catalogo } = useAsync(() => getCatalogoDaBanca(id!), [id])
  const [verificadaAberta, setVerificadaAberta] = useState(false)
  const { itens } = useCart()

  const itensDestaBanca = itens.filter((item) => item.bancaId === id)
  const totalNaSacola = itensDestaBanca.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)

  if (!banca) return null

  return (
    <Screen variant="wide">
      <div className="relative">
        <PlaceholderPhoto label="foto da banca (capa)" src={banca.fotoCapaUrl} className="h-37.5 w-full md:h-56" />
        <Link
          to="/bancas"
          aria-label="Voltar"
          className="absolute left-4 top-14.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/92"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <button
          type="button"
          aria-label="Favoritar"
          className="absolute right-4 top-14.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/92"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8C4A3A" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 20s-7-4.6-7-9.3A4.1 4.1 0 0112 8a4.1 4.1 0 017 2.7C19 15.4 12 20 12 20z" />
          </svg>
        </button>
      </div>

      <div className="border-b border-sand-border bg-white px-4.5 pb-3.5 pt-3.5 md:px-10">
        <div className="flex items-center gap-1.5">
          <h2 className="m-0 font-display text-2xl font-bold">{banca.nome}</h2>
          {banca.verificada && <VerifiedBadge onClick={() => setVerificadaAberta(true)} />}
        </div>
        <p className="mt-1.5 mb-0 text-xs text-muted-2">
          {banca.categorias.join(', ')}
          {banca.corredor && ` · ${banca.corredor}`}
        </p>
        <div className="mt-2.5 flex gap-4 text-xs font-medium">
          <span className="text-terracota">
            ★ {banca.rating.toFixed(1).replace('.', ',')} <span className="font-normal text-muted-2">(212)</span>
          </span>
          <span>{banca.distanciaKm} km</span>
          <span>Hoje, {formatEta(banca.etaMinutos)}</span>
          <span className="text-oliva">{banca.taxaEntregaLabel}</span>
        </div>
      </div>

      <div className="flex gap-4.5 border-b border-sand-border bg-white px-4.5 pt-3 text-sm font-semibold md:px-10">
        {abas.map((aba, i) => (
          <span
            key={aba}
            className={`pb-2.5 ${i === 0 ? 'border-b-[2.5px] border-terracota' : 'text-faded'}`}
          >
            {aba}
          </span>
        ))}
      </div>

      <div className="flex-1 px-4 pt-4 md:px-10">
        <div className="grid grid-cols-2 gap-3 pb-44 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {catalogo?.map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-sand-border bg-white"
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
          className="fixed inset-x-4 bottom-24 z-30 mx-auto flex max-w-[416px] items-center justify-between rounded-2xl bg-terracota px-4.5 py-3.5 text-white shadow-pill"
        >
          <span className="text-base font-semibold">
            {itensDestaBanca.length} {itensDestaBanca.length === 1 ? 'peça' : 'peças'} na sacola
          </span>
          <span className="text-lg font-bold">Ver sacola · {formatPrice(totalNaSacola)}</span>
        </Link>
      )}

      {verificadaAberta && <VerifiedInfoSheet onClose={() => setVerificadaAberta(false)} />}
    </Screen>
  )
}
