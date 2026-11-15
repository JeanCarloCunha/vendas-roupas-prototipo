import { NavLink, Link, Outlet } from 'react-router-dom'
import { PackagePlus, LogOut, Store } from 'lucide-react'

const links = [{ to: '/admin/produtos', label: 'Cadastro de produtos', icon: PackagePlus }]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-56 bg-gray-900 text-gray-100 p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-4">Painel Admin</h2>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm px-3 py-2 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        <div className="mt-auto flex flex-col gap-2 text-sm">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800">
            <Store size={16} /> Ver loja
          </Link>
          <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800">
            <LogOut size={16} /> Sair
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
