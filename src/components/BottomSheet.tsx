import type { ReactNode } from 'react'

interface BottomSheetProps {
  onClose: () => void
  icon: ReactNode
  title: string
  children: ReactNode
}

export function BottomSheet({ onClose, icon, title, children }: BottomSheetProps) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 lg:items-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-t-3xl bg-white px-5.5 pb-10 pt-6 lg:rounded-3xl lg:pb-7"
      >
        <div className="h-1.5 w-10 self-center rounded-full bg-sand-border lg:hidden" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-xl bg-verified-bg">
            {icon}
          </div>
          <span className="font-display text-xl font-bold leading-tight">{title}</span>
        </div>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-1.5 self-start rounded-xl px-2 py-1.5 text-sm font-semibold text-terracota transition-colors hover:text-barro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
