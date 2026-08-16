import { BottomSheet } from './BottomSheet'

interface AccountSheetProps {
  onClose: () => void
}

export function AccountSheet({ onClose }: AccountSheetProps) {
  return (
    <BottomSheet
      onClose={onClose}
      title="Sua conta"
      icon={
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-muted">
        Login, dados pessoais e histórico de pedidos ainda não estão disponíveis nesta versão.
      </p>
      <div className="mt-1.5 rounded-2xl bg-sand-chip p-3.5 text-sm leading-relaxed text-muted">
        Enquanto isso, acompanhe seus pedidos pela aba <strong className="font-semibold text-ink">Pedidos</strong>.
      </div>
    </BottomSheet>
  )
}
