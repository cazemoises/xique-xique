import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { SellerHeader } from '../components/SellerHeader'
import { PlaceholderPhoto } from '../components/PlaceholderPhoto'
import { useAsync } from '../hooks/useAsync'
import { getCatalogoDaBanca } from '../services/bancas'
import { removerProduto } from '../services/produtos'
import { formatPrice } from '../lib/formatPrice'
import type { Produto } from '../domain/produto'

const BANCA_ID = 'banca-dona-zefa'

export function SellerProducts() {
  const { data } = useAsync(() => getCatalogoDaBanca(BANCA_ID), [])
  const [produtos, setProdutos] = useState<Produto[] | null>(null)
  const [removendoId, setRemovendoId] = useState<string | null>(null)

  useEffect(() => {
    if (data) setProdutos(data)
  }, [data])

  async function remover(produto: Produto) {
    if (!window.confirm(`Remover "${produto.nome}" do catálogo?`)) return
    setRemovendoId(produto.id)
    try {
      await removerProduto(produto.id)
      setProdutos((atual) => atual?.filter((p) => p.id !== produto.id) ?? null)
    } finally {
      setRemovendoId(null)
    }
  }

  const vazio = produtos !== null && produtos.length === 0

  return (
    <Screen>
      <SellerHeader active="produtos" mobileTitle="Meus produtos" />

      {/* mobile */}
      <div className="flex-1 px-5 pt-4.5 pb-8 lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-2">{produtos?.length ?? 0} peças cadastradas</span>
          <Link to="/feirante/nova-peca" className="rounded-full bg-terracota px-3.5 py-2 text-xs font-semibold text-white">
            + Nova peça
          </Link>
        </div>

        {vazio && <EmptyState />}

        <div className="flex flex-col gap-2.5">
          {produtos?.map((produto) => (
            <ProdutoRow
              key={produto.id}
              produto={produto}
              removendo={removendoId === produto.id}
              onRemover={() => remover(produto)}
            />
          ))}
        </div>
      </div>

      {/* desktop */}
      <div className="hidden w-full max-w-page-narrow flex-1 flex-col gap-6 self-center px-8 py-11 lg:flex">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="m-0 font-display text-2xl font-bold">Meus produtos</h1>
            <p className="mt-1 mb-0 text-sm text-muted-2">{produtos?.length ?? 0} peças cadastradas nesta banca</p>
          </div>
          <Link to="/feirante/nova-peca" className="rounded-2xl bg-terracota px-5 py-3 text-sm font-semibold text-white shadow-cta">
            + Nova peça
          </Link>
        </div>

        {vazio && <EmptyState />}

        <div className="flex flex-col gap-2.5">
          {produtos?.map((produto) => (
            <ProdutoRow
              key={produto.id}
              produto={produto}
              removendo={removendoId === produto.id}
              onRemover={() => remover(produto)}
            />
          ))}
        </div>
      </div>
    </Screen>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-sand-border bg-white px-6 py-10 text-center">
      <span className="text-sm font-semibold text-muted">Nenhuma peça cadastrada ainda.</span>
      <Link to="/feirante/nova-peca" className="text-sm font-semibold text-terracota">
        Cadastrar a primeira peça
      </Link>
    </div>
  )
}

function ProdutoRow({
  produto,
  removendo,
  onRemover,
}: {
  produto: Produto
  removendo: boolean
  onRemover: () => void
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-sand-border bg-white p-3 lg:p-3.5">
      <PlaceholderPhoto label="foto peça" src={produto.fotos[0]} className="h-16 w-16 flex-none rounded-xl lg:h-18 lg:w-18" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold lg:text-base">{produto.nome}</span>
        <span className="text-sm font-bold text-ink">{formatPrice(produto.preco)}</span>
        <span className="text-xs text-muted-2">{produto.tamanhos.join(' · ')}</span>
      </div>
      <div className="flex flex-none items-center gap-2">
        <Link
          to={`/feirante/produtos/${produto.id}/editar`}
          className="rounded-full bg-sand-chip px-3 py-2 text-xs font-semibold text-muted-3"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={onRemover}
          disabled={removendo}
          className="rounded-full border border-sand-border bg-white px-3 py-2 text-xs font-semibold text-terracota disabled:opacity-50"
        >
          {removendo ? 'Removendo…' : 'Remover'}
        </button>
      </div>
    </div>
  )
}
