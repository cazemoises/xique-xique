import market1 from '../../assets/market/market-1.jpg'
import market2 from '../../assets/market/market-2.jpg'
import market3 from '../../assets/market/market-3.jpg'
import market4 from '../../assets/market/market-4.jpg'
import market5 from '../../assets/market/market-5.jpg'
import banca1 from '../../assets/market/banca-1.jpg'
import banca2 from '../../assets/market/banca-2.jpg'
import banca3 from '../../assets/market/banca-3.jpg'
import banca4 from '../../assets/market/banca-4.jpg'
import banca5 from '../../assets/market/banca-5.jpg'
import banca6 from '../../assets/market/banca-6.jpg'
import banca7 from '../../assets/market/banca-7.jpg'
import banca8 from '../../assets/market/banca-8.jpg'
import logo1 from '../../assets/market/logo-1.jpg'
import logo2 from '../../assets/market/logo-2.jpg'
import logo3 from '../../assets/market/logo-3.jpg'
import logo4 from '../../assets/market/logo-4.jpg'
import produto1 from '../../assets/market/produto-1.jpg'
import produto2 from '../../assets/market/produto-2.jpg'
import produto3 from '../../assets/market/produto-3.jpg'
import produto4 from '../../assets/market/produto-4.jpg'
import produto5 from '../../assets/market/produto-5.jpg'

const MARKET = [market1, market2, market3, market4, market5]
const BANCA = [banca1, banca2, banca3, banca4, banca5, banca6, banca7, banca8]
const LOGO = [logo1, logo2, logo3, logo4]
const PRODUTO = [produto1, produto2, produto3, produto4, produto5]

function pick(pool: string[], seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return pool[hash % pool.length]
}

export function marketImage(seed: string): string {
  return pick(MARKET, seed)
}

export function bancaImage(seed: string): string {
  return pick(BANCA, seed)
}

export function logoImage(seed: string): string {
  return pick(LOGO, seed)
}

export function produtoImage(seed: string): string {
  return pick(PRODUTO, seed)
}
