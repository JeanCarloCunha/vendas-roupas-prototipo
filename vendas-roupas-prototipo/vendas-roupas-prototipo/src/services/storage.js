// "Banco de dados" do protótipo: cada tabela do modelo de dados vira uma chave no localStorage.
import produtosSeed from '../data/produtos.json'

const TABELAS = ['usuarios', 'produtos', 'itens_carrinho', 'pedidos', 'itens_pedido', 'looks', 'look_itens']

export function getAll(tabela) {
  try {
    return JSON.parse(localStorage.getItem(tabela)) ?? []
  } catch {
    return []
  }
}

export function saveAll(tabela, dados) {
  localStorage.setItem(tabela, JSON.stringify(dados))
}

export function nextId(tabela) {
  const dados = getAll(tabela)
  return dados.length ? Math.max(...dados.map((d) => d.id)) + 1 : 1
}

export function insert(tabela, registro) {
  const novo = { id: nextId(tabela), ...registro }
  saveAll(tabela, [...getAll(tabela), novo])
  return novo
}

export function initStorage() {
  TABELAS.forEach((t) => {
    if (localStorage.getItem(t) === null) saveAll(t, [])
  })
  if (getAll('produtos').length === 0) saveAll('produtos', produtosSeed)
  if (getAll('usuarios').length === 0) {
    // Admin de teste do protótipo
    saveAll('usuarios', [
      { id: 1, nome: 'Administrador', email: 'admin@loja.com', senha: 'admin123', perfil: 'admin' },
    ])
  }
}
