import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { itensDoUsuario, total } from '../../services/carrinho'
import { finalizarCompra } from '../../services/pedidos'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

export default function Checkout() {
  const { usuario } = useAuth()
  const [pedido, setPedido] = useState(null)
  const itens = usuario ? itensDoUsuario(usuario.id) : []

  if (!usuario) return <Navigate to="/login" replace />

  if (pedido) {
    return (
      <section className="max-w-md">
        <h1 className="text-2xl font-bold mb-2">Compra finalizada!</h1>
        <p className="mb-4">Pedido <strong>#{pedido.id}</strong> no valor de {moeda(pedido.total)} registrado com sucesso.</p>
        <div className="flex gap-4">
          <Link to="/historico" className="bg-gray-900 text-white rounded px-4 py-2 hover:bg-gray-700">Ver histórico</Link>
          <Link to="/produtos" className="underline py-2">Continuar comprando</Link>
        </div>
      </section>
    )
  }

  if (itens.length === 0) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-500">Seu carrinho está vazio. <Link to="/produtos" className="underline">Ver produtos</Link></p>
      </section>
    )
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white border rounded divide-y mb-4">
        {itens.map((i) => (
          <div key={i.id} className="flex justify-between p-3 text-sm">
            <span>{i.quantidade}x {i.produto.nome} (Tam. {i.produto.tamanho}, {i.produto.cor})</span>
            <span className="font-semibold">{moeda(i.produto.preco * i.quantidade)}</span>
          </div>
        ))}
      </div>
      <p className="text-lg font-bold mb-4">Total: {moeda(total(itens))}</p>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setPedido(finalizarCompra(usuario.id))}
          className="bg-gray-900 text-white rounded px-5 py-2 hover:bg-gray-700"
        >
          Confirmar pedido
        </button>
        <Link to="/carrinho" className="underline text-sm">Voltar ao carrinho</Link>
      </div>
    </section>
  )
}
