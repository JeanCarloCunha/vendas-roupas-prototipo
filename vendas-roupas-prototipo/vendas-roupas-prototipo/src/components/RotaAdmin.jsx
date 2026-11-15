import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Só deixa passar quem está logado como admin.
export default function RotaAdmin() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.perfil !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
