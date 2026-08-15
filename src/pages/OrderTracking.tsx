import { useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
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
      <TopBar
        title={`Pedido #${pedido.id.replace('pedido-', '')}`}
        subtitle={`${bancaNome} · ${primeiroGrupo?.poloNome}`}
      />

      <div className="flex-1 px-5 pt-5">
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

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] items-center gap-2.5 border-t border-sand-border bg-white px-4 py-3 pb-7.5 md:sticky md:inset-x-auto">
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
    </Screen>
  )
}
