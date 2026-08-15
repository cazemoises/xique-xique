import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { useAsync } from '../hooks/useAsync'
import { getPolos } from '../services/polos'

const categorias = ['Tudo', 'Feminino', 'Masculino', 'Infantil', 'Cama']

export function Home() {
  const { data: polos } = useAsync(getPolos, [])

  return (
    <Screen>
      <header className="rounded-b-3xl bg-gradient-to-b from-terracota to-barro px-5 pb-4.5 pt-8 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">Entregar em</span>
            <span className="text-[15px] font-bold">Rua São Vicente, 120 ▾</span>
            <span className="text-[11.5px] opacity-85">Maurício de Nassau · Caruaru</span>
          </div>
          <div className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-full bg-white/18">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9B8574" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <span className="text-sm text-placeholder">Buscar roupa, banca ou feira</span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/bancas"
            className="flex flex-col gap-6.5 rounded-2xl bg-oliva p-3.5 pt-4 text-white shadow-[0_6px_16px_rgba(91,107,69,0.24)]"
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
              <span className="text-[11.5px] leading-snug opacity-80">Catálogo completo de cada vendedor</span>
            </div>
          </Link>
          <Link
            to="/buscar"
            className="flex flex-col gap-6.5 rounded-2xl bg-ink p-3.5 pt-4 text-white shadow-[0_6px_16px_rgba(36,26,22,0.2)]"
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
              <span className="text-[11.5px] leading-snug opacity-75">Compare preços de vários vendedores</span>
            </div>
          </Link>
        </div>

        <div className="mt-5.5 flex gap-2 overflow-x-auto">
          {categorias.map((categoria, i) => (
            <span
              key={categoria}
              className={`flex-none rounded-full px-3.5 py-2 text-[12.5px] font-medium ${
                i === 0 ? 'bg-ink text-white' : 'bg-sand-chip text-[#5C4A3D]'
              }`}
            >
              {categoria}
            </span>
          ))}
        </div>

        <div className="mt-5.5 flex items-baseline justify-between">
          <h3 className="m-0 font-display text-[17px] font-bold">Feiras abertas agora</h3>
          <span className="text-xs font-medium text-terracota">ver todas</span>
        </div>
        <div className="mt-3 flex gap-3">
          {polos?.map((polo) => (
            <div key={polo.id} className="flex-1 overflow-hidden rounded-2xl border border-sand-border bg-white">
              <PlaceholderPhoto label="foto feira" className="h-19.5" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2.5">
                <span className="text-[13px] font-bold leading-tight">{polo.nome}</span>
                <span className="text-[11px] text-muted-2">
                  {polo.bancasCount} bancas · até {polo.abertoAte}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-ocre p-4">
          <div className="flex-1 flex-col gap-0.5">
            <p className="m-0 font-display text-[14.5px] font-bold leading-tight text-ink">
              Entrega grátis na primeira compra
            </p>
            <p className="m-0 text-[11.5px] leading-snug text-[#5C4A3D]">Bancas a até 6 km de você</p>
          </div>
          <span className="flex-none rounded-full bg-ink px-3 py-2 text-[11.5px] font-semibold text-white">Usar</span>
        </div>
        <div className="h-4" />
      </main>

      <nav className="flex items-center justify-around border-t border-sand-border bg-white px-2 py-2.5 pb-6">
        <TabItem label="Início" active />
        <TabItem label="Buscar" />
        <Link to="/pedido/pedido-4127" className="contents">
          <TabItem label="Pedidos" />
        </Link>
        <TabItem label="Conta" />
      </nav>
    </Screen>
  )
}

function TabItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-terracota' : 'text-[#B0A093]'}`}>
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M3 10l9-7 9 7v10H3z" />
      </svg>
      <span className="text-[10px] font-semibold">{label}</span>
    </div>
  )
}
