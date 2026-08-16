import { Link } from 'react-router-dom'
import { TopBar } from './TopBar'

interface SellerHeaderProps {
  active: 'produtos' | 'form'
  mobileTitle: string
}

export function SellerHeader({ active, mobileTitle }: SellerHeaderProps) {
  return (
    <>
      <div className="lg:hidden">
        <TopBar title={mobileTitle} />
        <div className="flex items-center gap-2 border-b border-sand-border bg-white px-5 py-2.5">
          <Link
            to="/feirante/produtos"
            className={`rounded-full px-3 py-1.75 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
              active === 'produtos' ? 'bg-ink text-white' : 'bg-sand-chip text-muted-3 hover:bg-sand-2'
            }`}
          >
            Meus produtos
          </Link>
          <Link
            to="/feirante/nova-peca"
            className={`rounded-full px-3 py-1.75 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-1 ${
              active === 'form' ? 'bg-ink text-white' : 'bg-sand-chip text-muted-3 hover:bg-sand-2'
            }`}
          >
            Nova peça
          </Link>
        </div>
      </div>

      <div className="hidden h-18 flex-none items-center gap-7 bg-ink px-12 lg:flex">
        <div className="flex flex-none items-center gap-2.25">
          <svg width="15" height="19" viewBox="0 0 13 17" fill="none" stroke="#F0E4CE" strokeWidth="1.7" strokeLinecap="round">
            <path d="M6.5 16V4" />
            <path d="M6.5 9c0-3 2.3-4 2.3-4" />
            <path d="M6.5 12c0-2.3-2.3-3.2-2.3-3.2" />
            <circle cx="6.5" cy="2.6" r="1.3" fill="#F0E4CE" stroke="none" />
          </svg>
          <span className="font-display text-lg font-bold leading-none text-sand-chip">Painel da banca</span>
        </div>
        <nav className="flex flex-none items-center gap-5.5 font-sans text-sm font-semibold">
          <Link
            to="/feirante/produtos"
            className={`rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${active === 'produtos' ? 'text-white' : 'text-sand-2 hover:text-white'}`}
          >
            Meus produtos
          </Link>
          <Link
            to="/feirante/nova-peca"
            className={`rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${active === 'form' ? 'text-white' : 'text-sand-2 hover:text-white'}`}
          >
            Nova peça
          </Link>
        </nav>
        <span className="text-sm text-sand-2">Modas Dona Zefa</span>
        <div className="flex-1" />
        <Link
          to="/"
          className="rounded-sm text-sm font-medium text-sand-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Sair
        </Link>
      </div>
    </>
  )
}
