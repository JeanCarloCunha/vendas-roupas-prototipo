import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { pedidosDoUsuario } from '../../services/pedidos'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

export default function Historico() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />

  const pedidos = pedidosDoUsuario(usuario.id)

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Histórico de compras</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">
          Você ainda não fez nenhuma compra. <Link to="/produtos" className="underline">Ver produtos</Link>
        </p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white border rounded">
              <div className="flex justify-between bg-gray-100 px-4 py-2 text-sm">
                <span className="font-semibold">Pedido #{p.id}</span>
                <span>{new Date(p.data).toLocaleString('pt-BR')}</span>
              </div>
              <div className="divide-y">
                {p.itens.map((i) => (
                  <div key={i.id} className="flex justify-between px-4 py-2 text-sm">
                    <span>
                      {i.quantidade}x {i.produto?.nome ?? 'Produto removido'}
                      {i.produto && ` (Tam. ${i.produto.tamanho}, ${i.produto.cor})`}
                    </span>
                    <span>{moeda(i.preco_unitario * i.quantidade)}</span>
                  </div>
                ))}
              </div>
              <p className="px-4 py-2 text-right font-bold border-t">Total: {moeda(p.total)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
