import { useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { TopNav } from '../components/TopNav'
import { useAsync } from '../hooks/useAsync'
import { getPedido } from '../services/pedidos'
import { pedidoDemo, chatDemo } from '../mocks/data/pedidos'

const STATUS_LABEL: Record<string, string> = {
  recebido: 'Pedido recebido',
  confirmado: 'Banca confirmou',
  saiu_para_entrega: 'Saiu para entrega',
  entregue: 'Entregue',
}

export function OrderTracking() {
  const { id } = useParams<{ id: string }>()
  const { data: pedido } = useAsync(() => getPedido(id!), [id])

  if (!pedido) return null

  const primeiroGrupo = pedido.gruposEntrega[0]
  const bancaNome = primeiroGrupo?.bancas[0]?.bancaNome ?? 'Banca'
  const mensagens = pedido.id === pedidoDemo.id ? chatDemo : []

  return (
    <Screen>
      <TopNav
        title={`Pedido #${pedido.id.replace('pedido-', '')}`}
        subtitle={`${bancaNome} · ${primeiroGrupo?.poloNome}`}
      />

      <div className="lg:hidden">
        <TopBar
          title={`Pedido #${pedido.id.replace('pedido-', '')}`}
          subtitle={`${bancaNome} · ${primeiroGrupo?.poloNome}`}
        />
      </div>

      <div className="flex-1 px-5 pt-5 lg:hidden">
        <div className="flex flex-col gap-0.75 rounded-2xl bg-oliva p-4 text-white">
          <span className="font-display text-lg font-bold leading-tight">{STATUS_LABEL[pedido.status]}</span>
          <span className="text-xs leading-snug opacity-85">
            Chega entre 17h e 19h · motoboy da banca
          </span>
        </div>

        <div className="mt-5.5 flex flex-col">
          {pedido.etapas.map((etapa, i) => {
            const isLast = i === pedido.etapas.length - 1
            return (
              <div key={etapa.label} className="flex gap-3">
                <div className="flex w-5 flex-none flex-col items-center">
                  <div
                    className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                      etapa.concluida ? 'bg-oliva' : 'bg-sand-border'
                    }`}
                  >
                    {etapa.concluida && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    )}
                  </div>
                  {!isLast && (
                    <div className={`min-h-6.5 w-0.5 flex-1 ${etapa.concluida ? 'bg-oliva' : 'bg-sand-border'}`} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pb-5.5">
                  <span className={`text-base font-bold leading-tight ${etapa.concluida ? 'text-ink' : 'text-muted-2'}`}>
                    {etapa.label}
                  </span>
                  <span className="text-xs text-muted-2">{etapa.horario}</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mb-2.25 mt-1.5 text-base font-bold">Falar com a banca</p>
        <div className="flex flex-col gap-2.5 rounded-2xl border border-sand-border bg-white p-3">
          {mensagens.length === 0 && (
            <p className="m-0 text-xs text-muted-2">Nenhuma mensagem ainda.</p>
          )}
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-xl px-3 py-2.25 text-sm leading-snug ${
                msg.autor === 'comprador'
                  ? 'self-end rounded-br-[3px] bg-sand-chip text-ink'
                  : 'self-start rounded-bl-[3px] bg-verified-bg text-oliva'
              }`}
            >
              {msg.texto}
            </div>
          ))}
        </div>
        <div className="mt-5 h-17.5" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] items-center gap-2.5 border-t border-sand-border bg-white px-4 py-3 pb-7.5 md:sticky md:inset-x-auto lg:hidden">
        <div className="flex-1 rounded-full bg-sand-chip px-4 py-3 text-sm text-placeholder">
          Escreva uma mensagem…
        </div>
        <button
          type="button"
          aria-label="Enviar mensagem"
          className="flex h-10.5 w-10.5 flex-none items-center justify-center rounded-full bg-terracota"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l16-8-6 16-3-6-7-2z" />
          </svg>
        </button>
      </div>

      <div className="hidden flex-1 grid-cols-2 lg:grid">
        <div className="flex flex-col p-9">
          <div className="flex flex-col gap-1 rounded-2xl bg-oliva p-5 text-white">
            <span className="font-display text-xl font-bold leading-tight">{STATUS_LABEL[pedido.status]}</span>
            <span className="text-sm leading-snug opacity-85">Chega entre 17h e 19h · motoboy da banca</span>
          </div>

          <div className="mt-6.5 flex flex-col">
            {pedido.etapas.map((etapa, i) => {
              const isLast = i === pedido.etapas.length - 1
              return (
                <div key={etapa.label} className="flex gap-3.5">
                  <div className="flex w-5 flex-none flex-col items-center">
                    <div
                      className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                        etapa.concluida ? 'bg-oliva' : 'bg-sand-border'
                      }`}
                    >
                      {etapa.concluida && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      )}
                    </div>
                    {!isLast && (
                      <div className={`min-h-7.5 w-0.5 flex-1 ${etapa.concluida ? 'bg-oliva' : 'bg-sand-border'}`} />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-6.5">
                    <span className={`text-base font-bold leading-tight ${etapa.concluida ? 'text-ink' : 'text-muted-2'}`}>
                      {etapa.label}
                    </span>
                    <span className="text-xs text-muted-2">{etapa.horario}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mb-3 mt-1 text-base font-bold">Falar com a banca</p>
          <div className="flex flex-1 flex-col gap-2.75 rounded-2xl border border-sand-border bg-white p-3.5">
            {mensagens.length === 0 && <p className="m-0 text-sm text-muted-2">Nenhuma mensagem ainda.</p>}
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] rounded-xl px-3.25 py-2.5 text-sm leading-snug ${
                  msg.autor === 'comprador'
                    ? 'self-end rounded-br-[3px] bg-sand-chip text-ink'
                    : 'self-start rounded-bl-[3px] bg-verified-bg text-oliva'
                }`}
              >
                {msg.texto}
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2.5">
              <div className="flex-1 rounded-full bg-sand-chip px-4 py-3 text-sm text-placeholder">
                Escreva uma mensagem…
              </div>
              <button
                type="button"
                aria-label="Enviar mensagem"
                className="flex h-10.5 w-10.5 flex-none items-center justify-center rounded-full bg-terracota"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l16-8-6 16-3-6-7-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative border-l border-sand-border bg-sand shadow-[inset_0_0_28px_rgba(36,26,22,0.08)]">
          <div className="absolute inset-x-6 top-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_26px_rgba(36,26,22,0.14)]">
            <div className="h-10 w-10 flex-none rounded-full bg-ink" />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-bold leading-tight">Zeca — motoboy da banca</span>
              <span className="text-xs text-muted-2">A 1,2 km de você · chega em ~14 min</span>
            </div>
            <span className="text-xs font-semibold text-terracota">Ligar</span>
          </div>
          <div className="absolute left-1/2 top-1/2 h-6.5 w-6.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-terracota shadow-[0_4px_12px_rgba(36,26,22,0.3)]" />
          <span className="absolute bottom-6 left-6 rounded bg-cream/90 px-1.5 py-0.5 font-mono text-2xs text-muted-2">
            mapa da rota
          </span>
        </div>
      </div>
    </Screen>
  )
}
