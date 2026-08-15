import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { useAsync } from '../hooks/useAsync'
import { getPolos } from '../services/polos'

export function Fairs() {
  const { data: polos } = useAsync(() => getPolos(), [])

  return (
    <Screen variant="wide">
      <TopNav active="feiras" />

      <div className="flex items-center gap-3 border-b border-sand-border bg-white px-5 pt-8 pb-3.5 md:px-10 lg:hidden">
        <Link to="/" aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241A16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <span className="font-display text-lg font-bold">Feiras e polos</span>
      </div>

      <div className="flex-1 px-4 pt-3.5 pb-24 md:px-10 lg:hidden">
        <div className="grid grid-cols-2 gap-3">
          {polos?.map((polo) => (
            <Link
              key={polo.id}
              to={`/bancas?polo=${polo.id}`}
              className="overflow-hidden rounded-2xl border border-sand-border bg-white"
            >
              <PlaceholderPhoto label="foto feira" src={polo.fotoUrl} className="h-24 w-full" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2.5">
                <span className="text-sm font-bold leading-tight">{polo.nome}</span>
                <span className="text-xs text-muted-2">
                  {polo.bancasCount} bancas · até {polo.abertoAte}
                </span>
                <span className="text-2xs text-muted-2">{polo.endereco}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="px-12 pt-10">
          <h1 className="m-0 font-display text-2xl font-bold">Feiras e polos</h1>
          <p className="mt-1.5 mb-0 text-sm text-muted-2">
            {polos?.length ?? 0} feiras disponíveis · escolha uma pra ver as bancas de lá
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4.5 px-12 py-8">
          {polos?.map((polo) => (
            <Link
              key={polo.id}
              to={`/bancas?polo=${polo.id}`}
              className="overflow-hidden rounded-2xl border border-sand-border bg-white"
            >
              <PlaceholderPhoto label="foto feira" src={polo.fotoUrl} className="h-40 w-full" />
              <div className="flex flex-col gap-1 px-3.5 py-3.5">
                <span className="text-lg font-bold leading-tight">{polo.nome}</span>
                <span className="text-sm text-muted-2">
                  {polo.bancasCount} bancas · até {polo.abertoAte}
                </span>
                <span className="text-xs text-muted-2">{polo.endereco}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Screen>
  )
}
