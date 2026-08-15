import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TopBarProps {
  title: ReactNode
  subtitle?: ReactNode
  onBack?: () => void
}

export function TopBar({ title, subtitle, onBack }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 border-b border-sand-border bg-white px-5 py-3.5">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Voltar"
        className="flex-none"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-bold leading-none">{title}</span>
        {subtitle && <span className="text-xs leading-tight text-muted-2">{subtitle}</span>}
      </div>
    </div>
  )
}
