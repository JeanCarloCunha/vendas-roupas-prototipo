import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../../services/storage'
import { useAuth } from '../../context/AuthContext'
import { sugestoes, salvarLook, looksDoUsuario, removerLook } from '../../services/looks'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

function MiniLook({ pecas }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {pecas.map((p) => (
        <img key={p.id} src={p.imagem_url} alt={p.nome} title={p.nome} className="w-full aspect-[4/5] object-cover rounded" />
      ))}
    </div>
  )
}

export default function Provador() {
  const { usuario } = useAuth()
  const produtos = getAll('produtos')
  const [selecionados, setSelecionados] = useState([])
  const [favoritos, setFavoritos] = useState(() => (usuario ? looksDoUsuario(usuario.id) : []))
  const [aviso, setAviso] = useState('')

  const alternar = (id) =>
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]))

  const pecas = selecionados.map((id) => produtos.find((p) => p.id === id)).filter(Boolean)
  const total = pecas.reduce((soma, p) => soma + p.preco, 0)

  function favoritar(nome, ids) {
    if (!usuario) return setAviso('Entre na sua conta para salvar looks favoritos.')
    salvarLook(usuario.id, nome, ids)
    setFavoritos(looksDoUsuario(usuario.id))
    setAviso(`"${nome}" salvo nos favoritos!`)
  }

  function excluir(id) {
    removerLook(id)
    setFavoritos(looksDoUsuario(usuario.id))
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-1">Provador virtual</h1>
      <p className="text-gray-500 mb-4">Escolha as peças, monte a sua combinação ou veja sugestões de looks.</p>

      {aviso && (
        <p className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded p-2 text-sm">
          {aviso} {!usuario && <Link to="/login" className="underline font-medium">Entrar</Link>}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* RF07 – selecionar peças */}
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-2">1. Selecione as peças</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {produtos.map((p) => {
              const ativo = selecionados.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => alternar(p.id)}
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

        {/* RF08 – montar combinação (+ RF10 salvar) */}
        <aside className="bg-white border rounded p-4 h-fit md:sticky md:top-4">
          <h2 className="font-semibold mb-2">2. Sua combinação</h2>
          {pecas.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma peça selecionada.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {pecas.map((p) => (
                  <div key={p.id} className="relative">
                    <img src={p.imagem_url} alt={p.nome} className="w-full aspect-[4/5] object-cover rounded" />
                    <button
                      onClick={() => alternar(p.id)}
                      className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 text-xs"
                      aria-label={`Remover ${p.nome}`}
                    >
                      ✕
                    </button>
                    <p className="text-xs mt-1">{p.nome}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm mb-3">
                {pecas.length} peça(s) · <strong>{moeda(total)}</strong>
              </p>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => favoritar(`Meu look ${favoritos.length + 1}`, selecionados)}
                  className="bg-gray-900 text-white rounded px-3 py-1.5 text-sm hover:bg-gray-700"
                >
                  ♥ Salvar como favorito
                </button>
                <button onClick={() => setSelecionados([])} className="text-sm text-red-600 hover:underline">
                  Limpar
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* RF09 – sugestões de looks */}
      <h2 className="font-semibold mb-2">Sugestões de looks</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {sugestoes().map((s) => (
          <div key={s.nome} className="bg-white border rounded p-3">
            <MiniLook pecas={s.pecas} />
            <p className="text-sm font-semibold mt-2">{s.nome}</p>
            <p className="text-xs text-gray-500 mb-2">{moeda(s.pecas.reduce((t, p) => t + p.preco, 0))}</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => setSelecionados(s.pecas.map((p) => p.id))} className="text-sm underline text-left">
                Experimentar no provador
              </button>
              <button onClick={() => favoritar(s.nome, s.pecas.map((p) => p.id))} className="text-sm underline text-left">
                ♥ Favoritar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RF10 – looks favoritos */}
      <h2 className="font-semibold mb-2">Meus looks favoritos</h2>
      {!usuario ? (
        <p className="text-sm text-gray-500">
          <Link to="/login" className="underline">Entre</Link> para ver e salvar seus looks favoritos.
        </p>
      ) : favoritos.length === 0 ? (
        <p className="text-sm text-gray-500">Você ainda não salvou nenhum look.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favoritos.map((l) => (
            <div key={l.id} className="bg-white border rounded p-3">
              <MiniLook pecas={l.pecas} />
              <p className="text-sm font-semibold mt-2">{l.nome}</p>
              <button onClick={() => excluir(l.id)} className="text-sm text-red-600 hover:underline">
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
