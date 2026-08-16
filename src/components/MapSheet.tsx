import { BottomSheet } from './BottomSheet'

interface MapSheetProps {
  onClose: () => void
}

export function MapSheet({ onClose }: MapSheetProps) {
  return (
    <BottomSheet
      onClose={onClose}
      title="Mapa da feira"
      icon={
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-muted">
        O mapa interativo do <strong className="font-semibold text-ink">Parque 18 de Maio</strong> (corredores A–J)
        ainda não está disponível nesta versão.
      </p>
      <div className="mt-1.5 rounded-2xl bg-sand-chip p-3.5 text-sm leading-relaxed text-muted">
        Enquanto isso, use a lista de bancas — ela já mostra distância e tempo de entrega de cada uma.
      </div>
    </BottomSheet>
  )
}
