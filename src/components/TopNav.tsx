import { Link, useNavigate } from 'react-router-dom'
import { useState, type ReactNode, type KeyboardEvent } from 'react'
import { LocationSheet } from './LocationSheet'
import { AccountSheet } from './AccountSheet'

interface TopNavProps {
  active?: 'bancas' | 'buscar' | 'feiras'
  backTo?: string
  backLabel?: string
  showSearch?: boolean
  showLocation?: boolean
  showCart?: boolean
  title?: ReactNode
  subtitle?: ReactNode
}

export function Logo() {
  return (
    <Link
      to="/"
      className="flex flex-none items-center gap-2.25 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
    >
      <svg width="16" height="21" viewBox="0 0 13 17" fill="none" stroke="#8C4A3A" strokeWidth="1.7" strokeLinecap="round">
        <path d="M6.5 16V4" />
        <path d="M6.5 9c0-3 2.3-4 2.3-4" />
        <path d="M6.5 12c0-2.3-2.3-3.2-2.3-3.2" />
        <circle cx="6.5" cy="2.6" r="1.3" fill="#8C4A3A" stroke="none" />
      </svg>
      <span className="font-display text-xl font-bold leading-none text-ink">Xique-Xique</span>
    </Link>
  )
}

export function TopNav({ active, backTo, backLabel, showSearch, showLocation, showCart, title, subtitle }: TopNavProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [locationOpen, setLocationOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (title) {
    return (
      <div className="hidden h-19 flex-none items-center gap-3.5 border-b border-sand-border bg-white px-12 lg:flex">
        <Logo />
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg font-bold leading-none">{title}</span>
          {subtitle && <span className="text-xs leading-tight text-muted-2">{subtitle}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="hidden h-19 flex-none items-center gap-8 border-b border-sand-border bg-white px-12 lg:flex">
      <Logo />

      {active ? (
        <nav className="flex flex-none items-center gap-6.5 font-sans text-sm font-semibold">
          <Link
            to="/"
            className={
              active === 'bancas'
                ? 'flex h-19 items-center border-b-[2.5px] border-terracota text-ink'
                : 'flex h-19 items-center text-muted-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 rounded-sm'
            }
          >
            Bancas
          </Link>
          <Link
            to="/buscar"
            className={
              active === 'buscar'
                ? 'flex h-19 items-center border-b-[2.5px] border-terracota text-ink'
                : 'flex h-19 items-center text-muted-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 rounded-sm'
            }
          >
            Buscar peça
          </Link>
          <Link
            to="/feiras"
            className={
              active === 'feiras'
                ? 'flex h-19 items-center border-b-[2.5px] border-terracota text-ink'
                : 'flex h-19 items-center text-muted-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 rounded-sm'
            }
          >
            Feiras
          </Link>
          <Link
            to="/pedido/pedido-4127"
            className="text-muted-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 rounded-sm"
          >
            Pedidos
          </Link>
        </nav>
      ) : (
        backTo && (
          <Link
            to={backTo}
            className="flex flex-none items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A7565" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            {backLabel}
          </Link>
        )
      )}

      {showSearch ? (
        <div className="flex flex-1 justify-center">
          <div className="flex w-full max-w-105 items-center gap-2 rounded-full bg-sand-chip px-4 py-2.25 transition-colors focus-within:ring-2 focus-within:ring-terracota">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8574" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Buscar roupa, banca ou feira"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-placeholder"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {showLocation && (
        <button
          type="button"
          onClick={() => setLocationOpen(true)}
          className="flex flex-none items-center gap-2 rounded-full bg-sand-chip px-3.5 py-2.25 text-sm font-medium text-muted-3 transition-colors hover:bg-sand-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7565" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
          </svg>
          Rua São Vicente, 120 ▾
        </button>
      )}

      {showCart && (
        <Link
          to="/sacola"
          aria-label="Sacola"
          className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-xl bg-sand-chip transition-colors hover:bg-sand-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2" strokeLinejoin="round">
            <path d="M5 4h14l1.5 16H3.5z" />
            <path d="M9 8V4M15 8V4" />
          </svg>
        </Link>
      )}

      <button
        type="button"
        aria-label="Sua conta"
        onClick={() => setAccountOpen(true)}
        className="h-9.5 w-9.5 flex-none rounded-full bg-ink transition hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
      />

      {locationOpen && <LocationSheet onClose={() => setLocationOpen(false)} />}
      {accountOpen && <AccountSheet onClose={() => setAccountOpen(false)} />}
    </div>
  )
}
