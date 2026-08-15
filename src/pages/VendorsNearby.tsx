import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { VerifiedBadge } from '../components/VerifiedBadge'
import { VerifiedInfoSheet } from '../components/VerifiedInfoSheet'
import { useAsync } from '../hooks/useAsync'
import { getBancas } from '../services/bancas'
import { formatEta } from '../lib/formatEta'

const filtros = ['Mais perto ▾', 'Entrega hoje', 'Feminino', 'Pix']

export function VendorsNearby() {
  const { data: bancas } = useAsync(() => getBancas(), [])
  const [verificadaAberta, setVerificadaAberta] = useState(false)

  return (
    <Screen variant="wide">
      <div className="relative border-b border-sand-border bg-white px-5 pt-8 pb-3.5 md:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <span className="font-display text-lg font-bold">Bancas perto de você</span>
        </div>
        <div className="mt-3.5 flex gap-2 overflow-x-auto">
          {filtros.map((filtro, i) => (
            <span
              key={filtro}
              className={`flex-none rounded-full px-3 py-2 text-xs font-medium ${
                i === 0 ? 'bg-ink text-white font-semibold' : 'bg-sand-chip text-[#5C4A3D]'
              }`}
            >
              {filtro}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-3.5 md:px-10">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {bancas?.map((banca) => (
            <Link
              key={banca.id}
              to={`/banca/${banca.id}`}
              className="flex items-center gap-3 rounded-2xl border border-sand-border bg-white p-3"
            >
              <PlaceholderPhoto label="logo banca" src={banca.fotoLogoUrl} className="h-18 w-18 flex-none rounded-2xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14.5px] font-bold leading-tight">{banca.nome}</span>
                  {banca.verificada && <VerifiedBadge onClick={() => setVerificadaAberta(true)} />}
                </div>
                <span className="text-[11.5px] leading-snug text-muted-2">{banca.categorias.join(' · ')}</span>
                <div className="flex items-center gap-2 text-[11.5px] font-medium text-[#5C4A3D]">
                  <span className="text-terracota">★ {banca.rating.toFixed(1).replace('.', ',')}</span>
                  <span className="text-sand-border">·</span>
                  <span>{banca.distanciaKm} km</span>
                  <span className="text-sand-border">·</span>
                  <span>{formatEta(banca.etaMinutos)}</span>
                </div>
                <span className="text-[11px] font-medium text-muted">{banca.taxaEntregaLabel}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="my-1.5 mb-4.5 flex items-center gap-3 rounded-2xl bg-oliva p-4 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="2" strokeLinecap="round">
            <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="font-display text-[13.5px] font-bold leading-tight">Ver bancas no mapa da feira</span>
            <span className="text-[11px] opacity-80">Parque 18 de Maio · corredores A–J</span>
          </div>
        </div>
      </div>

      {verificadaAberta && <VerifiedInfoSheet onClose={() => setVerificadaAberta(false)} />}
    </Screen>
  )
}
