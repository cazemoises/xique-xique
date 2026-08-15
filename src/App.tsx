import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './state/CartContext'
import { Home } from './pages/Home'
import { VendorsNearby } from './pages/VendorsNearby'
import { VendorProfile } from './pages/VendorProfile'
import { ProductSearch } from './pages/ProductSearch'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { OrderTracking } from './pages/OrderTracking'
import { SellerProductForm } from './pages/SellerProductForm'
import { SellerProducts } from './pages/SellerProducts'
import { Fairs } from './pages/Fairs'
import { NotFound } from './pages/NotFound'

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
          <Route path="/feiras" element={<Fairs />} />
          <Route path="/feirante/produtos" element={<SellerProducts />} />
          <Route path="/feirante/produtos/:id/editar" element={<SellerProductForm />} />
          <Route path="/feirante/nova-peca" element={<SellerProductForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
