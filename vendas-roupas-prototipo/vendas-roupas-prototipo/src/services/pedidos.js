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
