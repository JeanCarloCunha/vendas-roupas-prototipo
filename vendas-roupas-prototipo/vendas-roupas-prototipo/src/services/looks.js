import { getAll, saveAll, insert } from './storage'

export function salvarLook(usuarioId, nome, produtoIds) {
  const look = insert('looks', {
    usuario_id: usuarioId,
    nome: nome.trim(),
    data: new Date().toISOString(),
  })
  produtoIds.forEach((produto_id) => insert('look_itens', { look_id: look.id, produto_id }))
  return look
}

export function looksDoUsuario(usuarioId) {
  const produtos = getAll('produtos')
  const itens = getAll('look_itens')
  return getAll('looks')
    .filter((l) => l.usuario_id === usuarioId)
    .sort((a, b) => b.id - a.id)
    .map((l) => ({
      ...l,
      pecas: itens
        .filter((i) => i.look_id === l.id)
        .map((i) => produtos.find((p) => p.id === i.produto_id))
        .filter(Boolean),
    }))
}

export function excluirLook(lookId) {
  saveAll('looks', getAll('looks').filter((l) => l.id !== lookId))
  saveAll('look_itens', getAll('look_itens').filter((i) => i.look_id !== lookId))
}
