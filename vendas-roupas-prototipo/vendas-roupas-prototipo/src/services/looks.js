// Looks favoritos (tabelas looks: id, usuario_id, nome | look_itens: id, look_id, produto_id)
import { getAll, saveAll, insert } from './storage'

// RF09 – sugestões: combinações de 3 peças do catálogo
export function sugestoes() {
  const produtos = getAll('produtos')
  if (produtos.length < 3) return []
  const n = Math.min(4, Math.floor(produtos.length / 3))
  const passo = Math.max(1, Math.floor(produtos.length / 3))
  return Array.from({ length: n }, (_, i) => ({
    nome: `Sugestão ${i + 1}`,
    pecas: [0, 1, 2].map((k) => produtos[(i + k * passo) % produtos.length]),
  }))
}

// RF10 – salvar / listar / remover favoritos
export function salvarLook(usuarioId, nome, produtoIds) {
  const look = insert('looks', { usuario_id: usuarioId, nome })
  produtoIds.forEach((produto_id) => insert('look_itens', { look_id: look.id, produto_id }))
  return look
}

export function looksDoUsuario(usuarioId) {
  const produtos = getAll('produtos')
  const itens = getAll('look_itens')
  return getAll('looks')
    .filter((l) => l.usuario_id === usuarioId)
    .map((l) => ({
      ...l,
      pecas: itens
        .filter((i) => i.look_id === l.id)
        .map((i) => produtos.find((p) => p.id === i.produto_id))
        .filter(Boolean),
    }))
}

export function removerLook(lookId) {
  saveAll('looks', getAll('looks').filter((l) => l.id !== lookId))
  saveAll('look_itens', getAll('look_itens').filter((i) => i.look_id !== lookId))
}
