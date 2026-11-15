import { Routes, Route, Navigate } from 'react-router-dom'
import ClienteLayout from './layouts/ClienteLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import Login from './pages/Login.jsx'
import Home from './pages/cliente/Home.jsx'
import Produtos from './pages/cliente/Produtos.jsx'
import Carrinho from './pages/cliente/Carrinho.jsx'
import Checkout from './pages/cliente/Checkout.jsx'
import Historico from './pages/cliente/Historico.jsx'
import Provador from './pages/cliente/Provador.jsx'
import AdminProdutos from './pages/admin/AdminProdutos.jsx'

export default function App() {
  return (
    <Routes>
      {/* Área do cliente */}
      <Route element={<ClienteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/provador" element={<Provador />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/historico" element={<Historico />} />
      </Route>

      {/* Área administrativa (a proteção por perfil entra no RF01) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/produtos" replace />} />
        <Route path="produtos" element={<AdminProdutos />} />
      </Route>
    </Routes>
  )
}
