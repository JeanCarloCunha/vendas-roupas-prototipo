import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Wand2 } from 'lucide-react'
import { getAll } from '../../services/storage'
import { adicionar } from '../../services/carrinho'
import { salvarLook, looksDoUsuario, excluirLook } from '../../services/looks'
import { sugerirLooks, notaLook, rotuloNota } from '../../services/sugestoes'
import { CATEGORIAS } from '../../data/categorias'
import { useAuth } from '../../context/AuthContext'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`
const somar = (pecas) => pecas.reduce((s, p) => s + p.preco, 0)

// Converte uma lista de peças em { categoria: peça }
function pecasParaSelecao(pecas) {
  const sel = {}
  pecas.forEach((p) => {
    sel[p.categoria] = p.id
    if (p.peca_unica) delete sel.perna // vestido cobre a parte de baixo
  })
  return sel
}

function MiniLook({ pecas }) {
  return (
    <div className="flex gap-1">
      {pecas.map((p) => (
        <img key={p.id} src={p.imagem_url} alt={p.nome} title={p.nome} className="w-1/4 aspect-[4/5] object-cover rounded" />
      ))}
    </div>
  )
}

export default function Provador() {
  const { usuario } = useAuth()
  const produtos = useMemo(() => getAll('produtos').filter((p) => CATEGORIAS.some((c) => c.id === p.categoria)), [])
  const [selecao, setSelecao] = useState({}) // { dorso: id, perna: id, pe: id, sobretudo: id }
  const [aba, setAba] = useState(CATEGORIAS[0].id)
  const [nomeLook, setNomeLook] = useState('')
  const [aviso, setAviso] = useState('')
  const [looksSalvos, setLooksSalvos] = useState(() => (usuario ? looksDoUsuario(usuario.id) : []))

  const porId = (id) => produtos.find((p) => p.id === id)
  const escolhidos = Object.fromEntries(
    Object.entries(selecao).map(([cat, id]) => [cat, porId(id)]).filter(([, p]) => p),
  )
  // Mantém a ordem dos espaços (sobretudo, dorso, perna, pé)
  const pecas = CATEGORIAS.map((c) => escolhidos[c.id]).filter(Boolean)
  const completo = escolhidos.dorso && (escolhidos.perna || escolhidos.dorso.peca_unica) && escolhidos.pe

  const sugestoes = useMemo(
    () => sugerirLooks(produtos, escolhidos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [produtos, selecao],
  )

  // RF07/RF08 – uma peça por categoria; clicar de novo remove
  function alternar(p) {
    setAviso('')
    setSelecao((atual) => {
      const novo = { ...atual }
      if (novo[p.categoria] === p.id) {
        delete novo[p.categoria]
        return novo
      }
      novo[p.categoria] = p.id
      // Vestido ocupa dorso+perna; peça de baixo não combina com vestido
      if (p.peca_unica) delete novo.perna
      if (p.categoria === 'perna' && novo.dorso && porId(novo.dorso)?.peca_unica) delete novo.dorso
      return novo
    })
  }

  function usarLook(lista) {
    setSelecao(pecasParaSelecao(lista))
    setAviso('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // RF10 – salvar favorito
  function salvar() {
    if (!completo) return setAviso('Monte um look com dorso, perna e pé antes de salvar.')
    const nome = nomeLook.trim() || `Look ${looksSalvos.length + 1}`
    salvarLook(usuario.id, nome, pecas.map((p) => p.id))
    setLooksSalvos(looksDoUsuario(usuario.id))
    setNomeLook('')
    setAviso(`Look "${nome}" salvo nos favoritos!`)
  }

  function remover(id) {
    excluirLook(id)
    setLooksSalvos(looksDoUsuario(usuario.id))
  }

  function comprar(lista) {
    lista.forEach((p) => adicionar(usuario.id, p.id))
    setAviso(`${lista.length} peça(s) adicionada(s) ao carrinho.`)
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-1">Provador virtual</h1>
      <p className="text-gray-500 mb-4">Escolha uma peça de cada categoria, veja sugestões de looks e salve seus favoritos.</p>

      {aviso && (
        <p className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded p-2 text-sm">
          {aviso}{' '}
          {aviso.includes('carrinho') && <Link to="/carrinho" className="underline font-medium">Ver carrinho</Link>}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* RF07 – selecionar peças por categoria */}
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-2">1. Selecione as peças</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                onClick={() => setAba(c.id)}
                className={`px-3 py-1 rounded-full text-sm border ${aba === c.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'}`}
              >
                {c.label}
                {selecao[c.id] ? ' ✓' : ''}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {CATEGORIAS.find((c) => c.id === aba).exemplo}
            {CATEGORIAS.find((c) => c.id === aba).opcional ? ' (opcional)' : ''}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {produtos.filter((p) => p.categoria === aba).map((p) => {
              const ativo = selecao[p.categoria] === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => alternar(p)}
                  className={`text-left bg-white border-2 rounded overflow-hidden ${ativo ? 'border-gray-900' : 'border-transparent'}`}
                >
                  <img src={p.imagem_url} alt={p.nome} className="w-full aspect-[4/5] object-cover" />
                  <div className="p-2 text-sm">
                    <p className="font-semibold">{p.nome}</p>
                    <p className="text-gray-500">Tam. {p.tamanho} · {p.cor}</p>
                    <p className="mt-1 text-xs font-medium">{ativo ? '✓ Selecionada' : 'Clique para selecionar'}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* RF08 – combinação + RF10 salvar */}
        <aside className="bg-white border rounded p-4 h-fit md:sticky md:top-4">
          <h2 className="font-semibold mb-2">2. Sua combinação</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {CATEGORIAS.map((c) => {
              const p = escolhidos[c.id]
              const coberto = c.id === 'perna' && escolhidos.dorso?.peca_unica
              return (
                <div key={c.id}>
                  {p ? (
                    <div className="relative">
                      <img src={p.imagem_url} alt={p.nome} className="w-full aspect-[4/5] object-cover rounded" />
                      <button
                        onClick={() => alternar(p)}
                        className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 text-xs"
                        aria-label={`Remover ${p.nome}`}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAba(c.id)}
                      className="w-full aspect-[4/5] border-2 border-dashed rounded text-xs text-gray-400 flex items-center justify-center text-center p-1"
                    >
                      {coberto ? 'Coberto pelo vestido' : `+ ${c.label}${c.opcional ? ' (opcional)' : ''}`}
                    </button>
                  )}
                  <p className="text-xs mt-1 truncate">{p ? p.nome : c.label}</p>
                </div>
              )
            })}
          </div>

          {pecas.length > 0 && (
            <>
              <p className="text-sm mb-1">
                {pecas.length} peça(s) · <strong>{moeda(somar(pecas))}</strong>
              </p>
              {pecas.length > 1 && (
                <p className="text-xs text-gray-500 mb-3">Harmonia de cores: {rotuloNota(notaLook(pecas))}</p>
              )}

              {usuario ? (
                <div className="grid gap-2">
                  <input
                    value={nomeLook}
                    onChange={(e) => setNomeLook(e.target.value)}
                    placeholder="Nome do look (opcional)"
                    className="border rounded px-2 py-1.5 text-sm"
                  />
                  <button onClick={salvar} className="flex items-center justify-center gap-1 bg-gray-900 text-white rounded py-1.5 text-sm hover:bg-gray-700">
                    <Heart size={14} /> Salvar nos favoritos
                  </button>
                  <button onClick={() => comprar(pecas)} className="flex items-center justify-center gap-1 border rounded py-1.5 text-sm hover:bg-gray-50">
                    <ShoppingCart size={14} /> Adicionar ao carrinho
                  </button>
                </div>
              ) : (
                <Link to="/login" className="block text-sm underline text-gray-600">Entre para salvar e comprar o look</Link>
              )}
              <button onClick={() => { setSelecao({}); setAviso('') }} className="mt-3 text-sm text-red-600 hover:underline">
                Limpar combinação
              </button>
            </>
          )}
        </aside>
      </div>

      {/* RF09 – sugestões */}
      <div className="mt-10">
        <h2 className="font-semibold mb-1 flex items-center gap-1"><Wand2 size={16} /> 3. Sugestões de looks</h2>
        <p className="text-sm text-gray-500 mb-3">
          {pecas.length === 0
            ? 'Looks montados com as peças da loja. Escolha uma peça para as sugestões completarem o seu look.'
            : 'Sugestões que completam as peças que você já escolheu.'}
        </p>
        {sugestoes.length === 0 ? (
          <p className="text-sm text-gray-500">Sem sugestões para esta combinação.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {sugestoes.map((s, i) => (
              <div key={i} className="bg-white border rounded p-3 flex flex-col gap-2">
                <MiniLook pecas={s.pecas} />
                <p className="text-xs text-gray-600">{s.pecas.map((p) => p.nome).join(' + ')}</p>
                <p className="text-xs"><span className="font-semibold">{rotuloNota(s.nota)}</span> · {moeda(somar(s.pecas))}</p>
                <button onClick={() => usarLook(s.pecas)} className="mt-auto border rounded py-1 text-sm hover:bg-gray-50">
                  Experimentar este look
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RF10 – favoritos */}
      <div className="mt-10">
        <h2 className="font-semibold mb-3 flex items-center gap-1"><Heart size={16} /> Meus looks favoritos</h2>
        {!usuario ? (
          <p className="text-sm text-gray-500">
            <Link to="/login" className="underline">Entre</Link> para salvar e ver seus looks favoritos.
          </p>
        ) : looksSalvos.length === 0 ? (
          <p className="text-sm text-gray-500">Você ainda não salvou nenhum look.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {looksSalvos.map((l) => (
              <div key={l.id} className="bg-white border rounded p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm truncate">{l.nome}</p>
                  <button onClick={() => remover(l.id)} className="text-red-600" aria-label={`Excluir ${l.nome}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <MiniLook pecas={l.pecas} />
                <p className="text-xs text-gray-600">{moeda(somar(l.pecas))}</p>
                <div className="mt-auto grid gap-1">
                  <button onClick={() => usarLook(l.pecas)} className="border rounded py-1 text-sm hover:bg-gray-50">Abrir no provador</button>
                  <button onClick={() => comprar(l.pecas)} className="bg-gray-900 text-white rounded py-1 text-sm hover:bg-gray-700">Adicionar ao carrinho</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
