import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Screen } from '../components/Screen'
import { formatPrice } from '../lib/formatPrice'

const TIPOS = ['Vestido', 'Blusa', 'Calça', 'Saia', 'Outro']
const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG']

export function SellerNewProduct() {
  const [tipo, setTipo] = useState(TIPOS[0])
  const [tamanho, setTamanho] = useState('M')
  const [preco, setPreco] = useState(89.9)
  const [quantidade, setQuantidade] = useState(3)
  const [publicado, setPublicado] = useState(false)

  return (
    <Screen>
      <TopBar title="Nova peça" />

      <div className="flex-1 px-5 pt-4.5">
        {publicado && (
          <div className="mb-3.5 rounded-2xl bg-verified-bg px-3.5 py-3 text-sm font-medium text-oliva">
            Peça publicada! Já aparece no catálogo da sua banca.
          </div>
        )}

        <div className="flex h-47.5 flex-col items-center justify-center gap-2.25 rounded-2xl border-2 border-dashed border-[#D8B98D] bg-[repeating-linear-gradient(135deg,#F0E0CC_0_8px,#E6D2B9_8px_16px)]">
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C6244" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13.5" r="3.5" />
            </svg>
          </div>
          <span className="text-base font-bold text-muted">Toque para tirar a foto</span>
          <span className="text-xs text-muted-2">Só 1 foto já publica a peça</span>
        </div>

        <p className="mb-2.25 mt-5 text-base font-bold">O que é?</p>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`rounded-full px-3.5 py-2.5 text-sm font-semibold ${
                t === tipo ? 'bg-ink text-white' : 'bg-sand-chip text-muted-3'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="mb-1 mt-5 text-base font-bold">Tamanho</p>
        <div className="mb-2.25 flex items-center gap-1.5 text-xs text-muted-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7565" strokeWidth="2.2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 2" />
          </svg>
          <span>Não sabe? Meça de axila a axila e a gente calcula pra você</span>
        </div>
        <div className="flex gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTamanho(t)}
              className={`min-w-11 rounded-xl border-[1.5px] py-2.75 text-center text-sm font-semibold ${
                t === tamanho ? 'border-ink bg-ink text-white' : 'border-sand-border bg-white text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <div className="flex-1">
            <p className="mb-2 text-base font-bold">Preço</p>
            <input
              type="number"
              step="0.10"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              className="w-full rounded-2xl border-[1.5px] border-sand-border bg-white px-3.5 py-3.25 font-display text-base font-bold outline-none"
            />
          </div>
          <div className="flex-1">
            <p className="mb-2 text-base font-bold">Quantas tem</p>
            <div className="flex items-center justify-between rounded-2xl border-[1.5px] border-sand-border bg-white px-3.5 py-3.25 text-lg font-semibold">
              <button type="button" onClick={() => setQuantidade((q) => Math.max(0, q - 1))} className="text-faded">
                −
              </button>
              <span>{quantidade}</span>
              <button type="button" onClick={() => setQuantidade((q) => q + 1)} className="text-terracota">
                +
              </button>
            </div>
          </div>
        </div>
        <div className="h-24" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-sand-border bg-white px-4.5 py-3.5 pb-7.5 md:sticky md:inset-x-auto">
        <button
          type="button"
          onClick={() => setPublicado(true)}
          className="w-full rounded-2xl bg-terracota py-4 text-center text-lg font-bold text-white shadow-cta"
        >
          Publicar peça · {formatPrice(preco)}
        </button>
      </div>
    </Screen>
  )
}
