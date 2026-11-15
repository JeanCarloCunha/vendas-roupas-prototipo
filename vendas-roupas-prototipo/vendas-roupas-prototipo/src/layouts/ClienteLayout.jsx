import { NavLink, Link, Outlet } from 'react-router-dom'
import { Shirt, ShoppingCart, User, History, Sparkles } from 'lucide-react'

const links = [
  { to: '/produtos', label: 'Produtos', icon: Shirt },
  { to: '/provador', label: 'Provador', icon: Sparkles },
  { to: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
  { to: '/historico', label: 'Histórico', icon: History },
  { to: '/login', label: 'Entrar', icon: User },
]

export default function ClienteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
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
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 p-4">
        <Link to="/admin/produtos" className="hover:text-gray-600">Área administrativa</Link>
      </footer>
    </div>
  )
}
