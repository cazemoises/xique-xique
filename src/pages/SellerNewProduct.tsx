import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Screen } from '../components/Screen'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
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
      <div className="lg:hidden">
        <TopBar title="Nova peça" />
      </div>

      <div className="hidden h-18 flex-none items-center gap-4 bg-ink px-12 lg:flex">
        <div className="flex flex-none items-center gap-2.25">
          <svg width="15" height="19" viewBox="0 0 13 17" fill="none" stroke="#F0E4CE" strokeWidth="1.7" strokeLinecap="round">
            <path d="M6.5 16V4" />
            <path d="M6.5 9c0-3 2.3-4 2.3-4" />
            <path d="M6.5 12c0-2.3-2.3-3.2-2.3-3.2" />
            <circle cx="6.5" cy="2.6" r="1.3" fill="#F0E4CE" stroke="none" />
          </svg>
          <span className="font-display text-lg font-bold leading-none text-sand-chip">Painel da banca</span>
        </div>
        <span className="text-sm text-sand-2">Modas Dona Zefa</span>
        <div className="flex-1" />
        <span className="text-sm font-medium text-sand-2">Sair</span>
      </div>

      <div className="flex-1 px-5 pt-4.5 lg:hidden">
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

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-sand-border bg-white px-4.5 py-3.5 pb-7.5 md:sticky md:inset-x-auto lg:hidden">
        <button
          type="button"
          onClick={() => setPublicado(true)}
          className="w-full rounded-2xl bg-terracota py-4 text-center text-lg font-bold text-white shadow-cta"
        >
          Publicar peça · {formatPrice(preco)}
        </button>
      </div>

      <div className="mx-auto hidden w-full max-w-page-narrow flex-1 gap-9 px-8 py-10 lg:grid lg:grid-cols-[1fr_22.5rem] lg:items-start">
        <div className="flex flex-col gap-5.5">
          {publicado && (
            <div className="rounded-2xl bg-verified-bg px-4 py-3.5 text-sm font-medium text-oliva">
              Peça publicada! Já aparece no catálogo da sua banca.
            </div>
          )}

          <h2 className="m-0 font-display text-2xl font-bold">Nova peça</h2>

          <div className="flex h-55 flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-[#D8B98D] bg-[repeating-linear-gradient(135deg,#F0E0CC_0_8px,#E6D2B9_8px_16px)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C6244" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13.5" r="3.5" />
              </svg>
            </div>
            <span className="text-base font-bold text-muted">Clique para enviar a foto</span>
            <span className="text-xs text-muted-2">Só 1 foto já publica a peça</span>
          </div>

          <div>
            <p className="mb-2.5 text-sm font-bold">O que é?</p>
            <div className="flex flex-wrap gap-2.25">
              {TIPOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={`rounded-full px-4 py-2.75 text-sm font-semibold ${
                    t === tipo ? 'bg-ink text-white' : 'bg-sand-chip text-muted-3'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.25 text-sm font-bold">Tamanho</p>
            <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7565" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
              <span>Não sabe? Meça de axila a axila e a gente calcula pra você</span>
            </div>
            <div className="flex gap-2.25">
              {TAMANHOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTamanho(t)}
                  className={`min-w-12.5 rounded-xl border-[1.5px] py-3 text-center text-sm font-semibold ${
                    t === tamanho ? 'border-ink bg-ink text-white' : 'border-sand-border bg-white text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className="mb-2.25 text-sm font-bold">Preço</p>
              <input
                type="number"
                step="0.10"
                value={preco}
                onChange={(e) => setPreco(Number(e.target.value))}
                className="w-full rounded-2xl border-[1.5px] border-sand-border bg-white px-4 py-3.5 font-display text-base font-bold outline-none"
              />
            </div>
            <div className="flex-1">
              <p className="mb-2.25 text-sm font-bold">Quantas tem</p>
              <div className="flex items-center justify-between rounded-2xl border-[1.5px] border-sand-border bg-white px-4 py-3.5 text-lg font-semibold">
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

          <button
            type="button"
            onClick={() => setPublicado(true)}
            className="max-w-80 rounded-2xl bg-terracota py-4.25 text-center text-base font-bold text-white shadow-cta"
          >
            Publicar peça · {formatPrice(preco)}
          </button>
        </div>

        <div className="sticky top-10 flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-2">Como o comprador vai ver</span>
          <div className="w-55 overflow-hidden rounded-2xl border border-sand-border bg-white">
            <PlaceholderPhoto label="foto peça" className="h-62.5 w-full" />
            <div className="flex flex-col gap-1 px-3.25 py-3.5">
              <span className="text-sm leading-snug">{tipo}</span>
              <span className="text-lg font-bold">{formatPrice(preco)}</span>
              <span className="text-xs text-muted-2">Tam. {tamanho} · Modas Dona Zefa</span>
            </div>
          </div>
          <p className="m-0 max-w-55 text-xs leading-relaxed text-muted-2">
            A pré-visualização atualiza conforme você preenche o cadastro.
          </p>
        </div>
      </div>
    </Screen>
  )
}
