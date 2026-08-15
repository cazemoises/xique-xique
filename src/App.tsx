import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './state/CartContext'
import { Home } from './pages/Home'
import { VendorsNearby } from './pages/VendorsNearby'
import { VendorProfile } from './pages/VendorProfile'
import { ProductSearch } from './pages/ProductSearch'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { OrderTracking } from './pages/OrderTracking'
import { SellerNewProduct } from './pages/SellerNewProduct'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bancas" element={<VendorsNearby />} />
          <Route path="/banca/:id" element={<VendorProfile />} />
          <Route path="/buscar" element={<ProductSearch />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/sacola" element={<Cart />} />
          <Route path="/pedido/:id" element={<OrderTracking />} />
          <Route path="/feirante/nova-peca" element={<SellerNewProduct />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
