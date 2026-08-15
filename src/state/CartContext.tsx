import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { ItemPedido } from '../domain/pedido'

interface CartState {
  itens: ItemPedido[]
  cupomCodigo?: string
}

type CartAction =
  | { type: 'ADICIONAR'; item: ItemPedido }
  | { type: 'REMOVER'; produtoId: string; tamanho: string }
  | { type: 'APLICAR_CUPOM'; codigo: string }
  | { type: 'LIMPAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADICIONAR': {
      const existente = state.itens.find(
        (i) => i.produtoId === action.item.produtoId && i.tamanho === action.item.tamanho,
      )
      if (existente) {
        return {
          ...state,
          itens: state.itens.map((i) =>
            i === existente ? { ...i, quantidade: i.quantidade + action.item.quantidade } : i,
          ),
        }
      }
      return { ...state, itens: [...state.itens, action.item] }
    }
    case 'REMOVER':
      return {
        ...state,
        itens: state.itens.filter(
          (i) => !(i.produtoId === action.produtoId && i.tamanho === action.tamanho),
        ),
      }
    case 'APLICAR_CUPOM':
      return { ...state, cupomCodigo: action.codigo }
    case 'LIMPAR':
      return { itens: [] }
  }
}

interface CartContextValue extends CartState {
  adicionarItem: (item: ItemPedido) => void
  removerItem: (produtoId: string, tamanho: string) => void
  aplicarCupom: (codigo: string) => void
  limparCarrinho: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { itens: [] })

  const value: CartContextValue = {
    ...state,
    adicionarItem: (item) => dispatch({ type: 'ADICIONAR', item }),
    removerItem: (produtoId, tamanho) => dispatch({ type: 'REMOVER', produtoId, tamanho }),
    aplicarCupom: (codigo) => dispatch({ type: 'APLICAR_CUPOM', codigo }),
    limparCarrinho: () => dispatch({ type: 'LIMPAR' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return ctx
}
