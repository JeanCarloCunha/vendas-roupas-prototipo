const NEUTRAS = ['branco', 'branca', 'preto', 'preta', 'cinza', 'bege', 'marrom']

const normalizar = (cor) => String(cor ?? '').trim().toLowerCase()
const ehNeutra = (cor) => NEUTRAS.includes(normalizar(cor))

function notaPar(a, b) {
  const ca = normalizar(a.cor)
  const cb = normalizar(b.cor)
  if (ehNeutra(ca) || ehNeutra(cb)) return ehNeutra(ca) && ehNeutra(cb) ? 2 : 3
  if (ca === cb) return 2
  return 0
}

export function notaLook(pecas) {
  if (pecas.length < 2) return 0
  let soma = 0
  let pares = 0
  for (let i = 0; i < pecas.length; i++) {
    for (let j = i + 1; j < pecas.length; j++) {
      soma += notaPar(pecas[i], pecas[j])
      pares++
    }
  }
  return soma / pares
}

export function rotuloNota(nota) {
  if (nota >= 2.5) return 'Combina muito'
  if (nota >= 1.5) return 'Combina bem'
  return 'Ousado'
}

export function sugerirLooks(produtos, selecionados, limite = 4) {
  const porCategoria = (cat) => produtos.filter((p) => p.categoria === cat)
  const opcoes = (cat, extra = []) => (selecionados[cat] ? [selecionados[cat]] : [...porCategoria(cat), ...extra])

  const dorsos = opcoes('dorso').filter((d) => !(selecionados.perna && d.peca_unica))
  const pes = opcoes('pe')
  const sobretudos = selecionados.sobretudo ? [selecionados.sobretudo] : [null, ...porCategoria('sobretudo')]

  const looks = []
  for (const dorso of dorsos) {
    const pernas = dorso.peca_unica ? [null] : opcoes('perna')
    for (const perna of pernas) {
      for (const pe of pes) {
        for (const sobretudo of sobretudos) {
          const pecas = [sobretudo, dorso, perna, pe].filter(Boolean)
          looks.push({ pecas, nota: notaLook(pecas) })
        }
      }
    }
  }

  looks.sort((a, b) => b.nota - a.nota || b.pecas.length - a.pecas.length)

  const usadosPorDorso = {}
  const escolhidos = []
  for (const l of looks) {
    const idDorso = l.pecas.find((p) => p.categoria === 'dorso').id
    usadosPorDorso[idDorso] = (usadosPorDorso[idDorso] ?? 0) + 1
    if (usadosPorDorso[idDorso] > 2 && !selecionados.dorso) continue
    escolhidos.push(l)
    if (escolhidos.length === limite) break
  }
  return escolhidos
}
