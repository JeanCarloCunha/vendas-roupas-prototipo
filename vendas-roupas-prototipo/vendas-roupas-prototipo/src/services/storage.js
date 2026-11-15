// "Banco de dados" do protótipo: cada tabela do modelo de dados vira uma chave no localStorage.
import produtosSeed from '../data/produtos.json'

const SEED_VERSAO = '3' // altere ao mudar src/data/produtos.json
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
  // Recarrega o catálogo inicial quando a versão do seed muda (ex.: troca das fotos)
  if (getAll('produtos').length === 0 || localStorage.getItem('seed_produtos_versao') !== SEED_VERSAO) {
    // Mantém os produtos cadastrados pelo admin (ids acima do catálogo inicial)
    const maiorIdSeed = Math.max(...produtosSeed.map((p) => p.id))
    const extras = getAll('produtos').filter((p) => p.id > maiorIdSeed)
    saveAll('produtos', [...produtosSeed, ...extras])
    localStorage.setItem('seed_produtos_versao', SEED_VERSAO)
  }
  if (getAll('usuarios').length === 0) {
    // Admin de teste do protótipo
    saveAll('usuarios', [
      { id: 1, nome: 'Administrador', email: 'admin@loja.com', senha: 'admin123', perfil: 'admin' },
    ])
  }
}
