import { Link } from 'react-router-dom'
import { Logo } from '../components/TopNav'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6 text-center lg:gap-6">
      <Logo />
      <span className="font-display text-5xl font-extrabold text-terracota lg:text-6xl">404</span>
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 font-display text-2xl font-bold text-ink lg:text-3xl">Essa banca não está aqui</h1>
        <p className="m-0 max-w-xs text-sm leading-relaxed text-muted-2 lg:max-w-sm lg:text-base">
          A página que você procura não existe ou mudou de lugar. Bora voltar pra feira principal?
        </p>
      </div>
      <Link
        to="/"
        className="mt-1 rounded-2xl bg-terracota px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition hover:bg-barro active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota lg:px-7 lg:py-4 lg:text-base"
      >
        Voltar para a Home
      </Link>
    </div>
  )
}
