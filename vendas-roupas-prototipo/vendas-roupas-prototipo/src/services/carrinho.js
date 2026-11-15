// Operações do carrinho (tabela itens_carrinho: id, usuario_id, produto_id, quantidade)
import { getAll, saveAll, insert } from './storage'

export function itensDoUsuario(usuarioId) {
  const produtos = getAll('produtos')
  return getAll('itens_carrinho')
    .filter((i) => i.usuario_id === usuarioId)
    .map((i) => ({ ...i, produto: produtos.find((p) => p.id === i.produto_id) }))
    .filter((i) => i.produto)
}

export function adicionar(usuarioId, produtoId) {
  const itens = getAll('itens_carrinho')
  const existente = itens.find((i) => i.usuario_id === usuarioId && i.produto_id === produtoId)
  if (existente) {
    saveAll('itens_carrinho', itens.map((i) => (i.id === existente.id ? { ...i, quantidade: i.quantidade + 1 } : i)))
  } else {
    insert('itens_carrinho', { usuario_id: usuarioId, produto_id: produtoId, quantidade: 1 })
  }
}

export function alterarQuantidade(itemId, quantidade) {
  if (quantidade < 1) return
  saveAll('itens_carrinho', getAll('itens_carrinho').map((i) => (i.id === itemId ? { ...i, quantidade } : i)))
}

export function remover(itemId) {
  saveAll('itens_carrinho', getAll('itens_carrinho').filter((i) => i.id !== itemId))
}

export function total(itens) {
  return itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0)
}
