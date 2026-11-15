import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../../services/storage'
import { adicionar } from '../../services/carrinho'
import { useAuth } from '../../context/AuthContext'
import ProdutoCard from '../../components/ProdutoCard'

export default function Produtos() {
  const { usuario } = useAuth()
  const produtos = getAll('produtos')
  const [aviso, setAviso] = useState('')

  function adicionarAoCarrinho(produto) {
    adicionar(usuario.id, produto.id)
    setAviso(`"${produto.nome}" adicionado ao carrinho.`)
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      {aviso && (
        <p className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded p-2 text-sm">
          {aviso} <Link to="/carrinho" className="underline font-medium">Ver carrinho</Link>
        </p>
      )}
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p}>
              {usuario ? (
                <button
                  onClick={() => adicionarAoCarrinho(p)}
                  className="w-full bg-gray-900 text-white rounded py-1.5 text-sm hover:bg-gray-700"
                >
                  Adicionar ao carrinho
                </button>
              ) : (
                <Link to="/login" className="block text-center text-sm underline text-gray-600">
                  Entre para comprar
                </Link>
              )}
            </ProdutoCard>
          ))}
        </div>
      )}
    </section>
  )
}
