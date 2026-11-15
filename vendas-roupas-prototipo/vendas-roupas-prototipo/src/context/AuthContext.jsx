import { createContext, useContext, useState } from 'react'
import { getAll, insert } from '../services/storage.js'

const AuthContext = createContext(null)
const CHAVE_SESSAO = 'sessao_usuario_id'

function carregarSessao() {
  const id = Number(localStorage.getItem(CHAVE_SESSAO))
  if (!id) return null
  return getAll('usuarios').find((u) => u.id === id) ?? null
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(carregarSessao)

  function iniciarSessao(u) {
    localStorage.setItem(CHAVE_SESSAO, String(u.id))
    setUsuario(u)
  }

  function login(email, senha) {
    const u = getAll('usuarios').find(
      (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.senha === senha
    )
    if (!u) return { ok: false, erro: 'E-mail ou senha inválidos.' }
    iniciarSessao(u)
    return { ok: true, usuario: u }
  }

  // Todo cadastro novo é de cliente. O admin já existe no storage.js.
  function cadastrar({ nome, email, senha }) {
    const emailNorm = email.trim().toLowerCase()
    if (getAll('usuarios').some((x) => x.email.toLowerCase() === emailNorm)) {
      return { ok: false, erro: 'Já existe um usuário com este e-mail.' }
    }
    const novo = insert('usuarios', { nome: nome.trim(), email: emailNorm, senha, perfil: 'cliente' })
    iniciarSessao(novo)
    return { ok: true, usuario: novo }
  }

  function logout() {
    localStorage.removeItem(CHAVE_SESSAO)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
