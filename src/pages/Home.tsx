import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopNav } from '../components/TopNav'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { useAsync } from '../hooks/useAsync'
import { getPolos } from '../services/polos'
import { marketImage, produtoImage, bancaImage } from '../mocks/data/curatedImage'

const categorias = ['Tudo', 'Feminino', 'Masculino', 'Infantil', 'Cama']

export function Home() {
  const { data: polos } = useAsync(getPolos, [])
  const [categoriaAtiva, setCategoriaAtiva] = useState(categorias[0])

  return (
    <Screen variant="wide">
      <TopNav active="bancas" showLocation showCart />

      <header className="rounded-b-3xl bg-gradient-to-b from-terracota to-barro px-5 pb-4.5 pt-8 text-white md:px-10 md:pb-8 md:pt-10 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide opacity-80">Entregar em</span>
            <span className="text-lg font-bold">Rua São Vicente, 120 ▾</span>
            <span className="text-xs opacity-85">Maurício de Nassau · Caruaru</span>
          </div>
          <div className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-full bg-white/18">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
          </div>
        </div>
        <Link to="/buscar" className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9B8574" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <span className="text-sm text-placeholder">Buscar roupa, banca ou feira</span>
        </Link>
      </header>

      <main className="flex-1 px-5 pt-5 md:px-10 lg:hidden">
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <Link
            to="/bancas"
            className="flex flex-col gap-6.5 rounded-2xl bg-oliva p-3.5 pt-4 text-white shadow-accent-oliva md:p-5 md:pt-6"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l2-5h14l2 5" />
              <path d="M4 9h16v11H4z" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-base font-bold leading-tight">
                Ver bancas
                <br />
                perto de mim
              </span>
              <span className="text-xs leading-snug opacity-80">Catálogo completo de cada vendedor</span>
            </div>
          </Link>
          <Link
            to="/buscar"
            className="flex flex-col gap-6.5 rounded-2xl bg-ink p-3.5 pt-4 text-white shadow-accent-ink md:p-5 md:pt-6"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h10" />
              <circle cx="18.5" cy="18" r="3.2" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-base font-bold leading-tight">
                Procurar
                <br />
                uma peça
              </span>
              <span className="text-xs leading-snug opacity-75">Compare preços de vários vendedores</span>
            </div>
          </Link>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaAtiva(categoria)}
              className={`flex-none rounded-full px-3 py-2 text-sm font-medium ${
                categoria === categoriaAtiva ? 'bg-ink text-white' : 'bg-sand-chip text-muted-3'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <h3 className="m-0 font-display text-xl font-bold">Feiras abertas agora</h3>
          <span className="text-xs font-medium text-terracota">ver todas</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:[grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))]">
          {polos?.map((polo) => (
            <div key={polo.id} className="overflow-hidden rounded-2xl border border-sand-border bg-white">
              <PlaceholderPhoto label="foto feira" src={polo.fotoUrl} className="h-19.5 w-full md:h-32" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2.5">
                <span className="text-sm font-bold leading-tight">{polo.nome}</span>
                <span className="text-xs text-muted-2">
                  {polo.bancasCount} bancas · até {polo.abertoAte}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-ocre p-4">
          <div className="flex-1 flex-col gap-0.5">
            <p className="m-0 font-display text-lg font-bold leading-tight text-ink">
              Entrega grátis na primeira compra
            </p>
            <p className="m-0 text-xs leading-snug text-muted-3">Bancas a até 6 km de você</p>
          </div>
          <span className="flex-none rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white">Usar</span>
        </div>
        <div className="h-24" />
      </main>

      <main className="hidden flex-1 lg:block">
        <div className="grid grid-cols-[minmax(20rem,40rem)_1fr] items-center gap-14 bg-sand px-12 py-14">
          <div className="flex flex-col gap-4.5">
            <h1 className="m-0 text-pretty font-display text-4xl font-extrabold leading-tight text-ink">
              Roupa de feira, entregue na sua porta
            </h1>
            <p className="m-0 max-w-125 text-lg leading-relaxed text-muted-3">
              As bancas do Parque 18 de Maio, da Sulanca e do Alto do Moura, direto pra você — sem sair de casa.
            </p>
            <Link to="/buscar" className="flex items-center gap-2.5 rounded-2xl bg-white px-4.5 py-3.5 shadow-cta">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9B8574" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <span className="flex-1 text-base text-placeholder">Buscar roupa, banca ou feira</span>
              <span className="rounded-xl bg-terracota px-4.5 py-2.75 text-sm font-semibold text-white">Buscar</span>
            </Link>
            <div className="flex flex-wrap gap-2.5">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`flex-none rounded-full px-3.5 py-2.25 text-sm font-medium ${
                    categoria === categoriaAtiva ? 'bg-ink text-white' : 'bg-white text-muted-3'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
          <div className="grid h-96 grid-cols-2 grid-rows-2 gap-3.5">
            <PlaceholderPhoto
              label="foto feira"
              src={marketImage('home-hero-feira')}
              className="row-span-2 h-full rounded-3xl"
            />
            <PlaceholderPhoto label="foto peça" src={produtoImage('home-hero-peca')} className="h-full rounded-3xl" />
            <PlaceholderPhoto label="foto banca" src={bancaImage('home-hero-banca')} className="h-full rounded-3xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 px-12 pt-10">
          <Link
            to="/bancas"
            className="flex items-center gap-6.5 rounded-3xl bg-oliva p-8 text-white shadow-accent-oliva"
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M3 9l2-5h14l2 5" />
              <path d="M4 9h16v11H4z" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-2xl font-bold leading-tight">Ver bancas perto de mim</span>
              <span className="text-sm leading-snug opacity-80">
                Navegue pelo catálogo completo de cada vendedor, como numa feira de verdade
              </span>
            </div>
          </Link>
          <Link to="/buscar" className="flex items-center gap-6.5 rounded-3xl bg-ink p-8 text-white shadow-accent-ink">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#C08A3E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M4 6h16M4 12h16M4 18h10" />
              <circle cx="18.5" cy="18" r="3.2" />
            </svg>
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-2xl font-bold leading-tight">Procurar uma peça</span>
              <span className="text-sm leading-snug opacity-75">
                Compare preço, tamanho e prazo entre várias bancas de uma vez
              </span>
            </div>
          </Link>
        </div>

        <div className="px-12 pt-11">
          <div className="flex items-baseline justify-between">
            <h3 className="m-0 font-display text-2xl font-bold">Feiras abertas agora</h3>
            <span className="text-sm font-semibold text-terracota">ver todas →</span>
          </div>
          <div className="mt-4.5 grid grid-cols-4 gap-4.5">
            {polos?.map((polo) => (
              <div key={polo.id} className="overflow-hidden rounded-2xl border border-sand-border bg-white">
                <PlaceholderPhoto label="foto feira" src={polo.fotoUrl} className="h-32.5 w-full" />
                <div className="flex flex-col gap-1 px-3.5 py-3.5">
                  <span className="text-lg font-bold leading-tight">{polo.nome}</span>
                  <span className="text-sm text-muted-2">
                    {polo.bancasCount} bancas · até {polo.abertoAte}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-12 mt-10 flex items-center gap-5 rounded-3xl bg-ocre p-6.5">
          <div className="flex-1 flex-col gap-1">
            <p className="m-0 font-display text-xl font-bold leading-tight text-ink">
              Entrega grátis na primeira compra
            </p>
            <p className="m-0 text-sm leading-snug text-muted-3">Bancas a até 6 km de você</p>
          </div>
          <span className="flex-none rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Usar cupom</span>
        </div>
        <div className="h-16" />
      </main>
    </Screen>
  )
}
