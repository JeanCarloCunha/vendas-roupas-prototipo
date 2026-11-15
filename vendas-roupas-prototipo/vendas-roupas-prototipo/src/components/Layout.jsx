import { NavLink, Outlet } from 'react-router-dom'
import { Shirt, ShoppingCart, User, History, Sparkles, Settings } from 'lucide-react'

const links = [
  { to: '/produtos', label: 'Produtos', icon: Shirt },
  { to: '/provador', label: 'Provador', icon: Sparkles },
  { to: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
  { to: '/historico', label: 'Histórico', icon: History },
  { to: '/admin/produtos', label: 'Admin', icon: Settings },
  { to: '/login', label: 'Entrar', icon: User },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <nav className="max-w-6xl mx-auto flex flex-wrap items-center gap-4 p-4">
          <NavLink to="/" className="text-xl font-bold mr-auto">Vendas de Roupas</NavLink>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm ${isActive ? 'font-semibold text-indigo-600' : 'text-gray-600'}`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
