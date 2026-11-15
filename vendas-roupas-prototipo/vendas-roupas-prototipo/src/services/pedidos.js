// Pedidos (tabelas pedidos e itens_pedido)
import { getAll, saveAll, insert } from './storage'
import { itensDoUsuario, total } from './carrinho'

export function finalizarCompra(usuarioId) {
  const itens = itensDoUsuario(usuarioId)
  if (itens.length === 0) return null

  const pedido = insert('pedidos', {
    usuario_id: usuarioId,
    data: new Date().toISOString(),
    total: total(itens),
  })
  itens.forEach((i) =>
    insert('itens_pedido', {
      pedido_id: pedido.id,
      produto_id: i.produto_id,
      quantidade: i.quantidade,
      preco_unitario: i.produto.preco,
    }),
  )
  // esvazia o carrinho do usuário
  saveAll('itens_carrinho', getAll('itens_carrinho').filter((i) => i.usuario_id !== usuarioId))
  return pedido
}

export function pedidosDoUsuario(usuarioId) {
  const produtos = getAll('produtos')
  const itens = getAll('itens_pedido')
  return getAll('pedidos')
    .filter((p) => p.usuario_id === usuarioId)
    .sort((a, b) => b.id - a.id)
    .map((p) => ({
      ...p,
      itens: itens
        .filter((i) => i.pedido_id === p.id)
        .map((i) => ({ ...i, produto: produtos.find((pr) => pr.id === i.produto_id) })),
    }))
}
