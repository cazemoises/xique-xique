import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AccountSheet } from './AccountSheet'

const TABS = [
  {
    label: 'Início',
    to: '/',
    isActive: (pathname: string) =>
      pathname === '/' || pathname.startsWith('/bancas') || pathname.startsWith('/banca/') || pathname === '/feiras',
    icon: (
      <path d="M3 10l9-7 9 7v10H3z" />
    ),
  },
  {
    label: 'Buscar',
    to: '/buscar',
    isActive: (pathname: string) => pathname === '/buscar',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </>
    ),
  },
  {
    label: 'Pedidos',
    to: '/pedido/pedido-4127',
    isActive: (pathname: string) => pathname.startsWith('/pedido'),
    icon: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  },
  {
    label: 'Conta',
    to: null,
    isActive: () => false,
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-md items-center justify-around border-t border-sand-border bg-white px-2 py-2.5 pb-6 lg:hidden">
      {TABS.map((tab) => {
        const active = tab.isActive(pathname)
        const item = (
          <div
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-terracota' : 'text-faded hover:text-muted-3'}`}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {tab.icon}
            </svg>
            <span className="text-2xs font-semibold">{tab.label}</span>
          </div>
        )
        const focusRing =
          'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1'
        return tab.to ? (
          <Link key={tab.label} to={tab.to} className={`flex px-2 py-1 ${focusRing}`}>
            {item}
          </Link>
        ) : (
          <button
            key={tab.label}
            type="button"
            onClick={() => setAccountOpen(true)}
            className={`flex px-2 py-1 ${focusRing}`}
          >
            {item}
          </button>
        )
      })}

      {accountOpen && <AccountSheet onClose={() => setAccountOpen(false)} />}
    </nav>
  )
}
