import { BottomSheet } from './BottomSheet'

interface LocationSheetProps {
  onClose: () => void
}

export function LocationSheet({ onClose }: LocationSheetProps) {
  return (
    <BottomSheet
      onClose={onClose}
      title="Endereço de entrega"
      icon={
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-muted">
        Suas bancas e feiras estão sendo mostradas para{' '}
        <strong className="font-semibold text-ink">Rua São Vicente, 120 — Maurício de Nassau, Caruaru</strong>.
      </p>
      <div className="mt-1.5 rounded-2xl bg-sand-chip p-3.5 text-sm leading-relaxed text-muted">
        Trocar de endereço ainda não está disponível nesta versão.
      </div>
    </BottomSheet>
  )
}
