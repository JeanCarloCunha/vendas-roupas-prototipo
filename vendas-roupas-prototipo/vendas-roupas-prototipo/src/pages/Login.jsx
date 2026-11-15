import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const destinoPorPerfil = (u) => (u.perfil === 'admin' ? '/admin/produtos' : '/produtos')

export default function Login() {
  const { usuario, login, cadastrar, logout } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState('entrar')
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')

  const atualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function trocarModo(novo) {
    setModo(novo)
    setErro('')
  }

  function enviar(e) {
    e.preventDefault()
    setErro('')
    if (modo === 'cadastrar') {
      if (form.nome.trim().length < 2) return setErro('Informe seu nome.')
      if (form.senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.')
    }
    const resultado = modo === 'entrar' ? login(form.email, form.senha) : cadastrar(form)
    if (!resultado.ok) return setErro(resultado.erro)
    navigate(destinoPorPerfil(resultado.usuario))
  }

  if (usuario) {
    return (
      <section className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
        <p className="mb-4">
          Você já está logado como <strong>{usuario.nome}</strong> ({usuario.perfil}).
        </p>
        <div className="flex justify-center gap-3">
          <Link to={destinoPorPerfil(usuario)} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Continuar
          </Link>
          <button onClick={logout} className="border px-4 py-2 rounded">Sair</button>
        </div>
      </section>
    )
  }

  const campo = 'w-full border rounded px-3 py-2'

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <div className="flex mb-6 border-b">
        {['entrar', 'cadastrar'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => trocarModo(m)}
            className={`flex-1 pb-2 ${modo === m ? 'border-b-2 border-indigo-600 font-semibold text-indigo-600' : 'text-gray-500'}`}
          >
            {m === 'entrar' ? 'Entrar' : 'Cadastrar'}
          </button>
        ))}
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-4">
        {modo === 'cadastrar' && (
          <label className="flex flex-col gap-1 text-sm">
            Nome
            <input className={campo} value={form.nome} onChange={atualizar('nome')} required />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input type="email" className={campo} value={form.email} onChange={atualizar('email')} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha
          <input type="password" className={campo} value={form.senha} onChange={atualizar('senha')} required />
        </label>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
          {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Admin de teste: admin@loja.com / admin123
      </p>
    </section>
  )
}
