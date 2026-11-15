import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { itensDoUsuario, alterarQuantidade, remover, total } from '../../services/carrinho'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

export default function Carrinho() {
  const { usuario } = useAuth()
  const [itens, setItens] = useState(() => (usuario ? itensDoUsuario(usuario.id) : []))

  if (!usuario) return <Navigate to="/login" replace />

  const recarregar = () => setItens(itensDoUsuario(usuario.id))

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Carrinho</h1>

      {itens.length === 0 ? (
        <p className="text-gray-500">
          Seu carrinho está vazio. <Link to="/produtos" className="underline">Ver produtos</Link>
        </p>
      ) : (
        <>
          <div className="bg-white border rounded divide-y mb-4">
            {itens.map((i) => (
              <div key={i.id} className="flex items-center gap-4 p-3">
                <img src={i.produto.imagem_url} alt={i.produto.nome} className="w-14 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{i.produto.nome}</p>
                  <p className="text-sm text-gray-500">Tam. {i.produto.tamanho} · {i.produto.cor}</p>
                  <p className="text-sm">{moeda(i.produto.preco)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { alterarQuantidade(i.id, i.quantidade - 1); recarregar() }} className="border rounded w-7 h-7">−</button>
                  <span className="w-6 text-center">{i.quantidade}</span>
                  <button onClick={() => { alterarQuantidade(i.id, i.quantidade + 1); recarregar() }} className="border rounded w-7 h-7">+</button>
                </div>
                <p className="w-24 text-right font-semibold">{moeda(i.produto.preco * i.quantidade)}</p>
                <button onClick={() => { remover(i.id); recarregar() }} className="text-red-600 text-sm hover:underline">Remover</button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Total: {moeda(total(itens))}</p>
            <Link to="/checkout" className="bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700">
              Finalizar compra
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
