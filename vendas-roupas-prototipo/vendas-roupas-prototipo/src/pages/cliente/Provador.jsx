import { useState } from 'react'
import { getAll } from '../../services/storage'

const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

export default function Provador() {
  const produtos = getAll('produtos')
  const [selecionados, setSelecionados] = useState([]) // ids das peças escolhidas

  const alternar = (id) =>
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]))

  const pecas = selecionados.map((id) => produtos.find((p) => p.id === id)).filter(Boolean)
  const total = pecas.reduce((soma, p) => soma + p.preco, 0)

  return (
    <section>
      <h1 className="text-2xl font-bold mb-1">Provador virtual</h1>
      <p className="text-gray-500 mb-4">Escolha as peças e monte a sua combinação.</p>

      <div className="grid md:grid-cols-3 gap-6">
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

        {/* RF08 – montar combinação */}
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
              <button onClick={() => setSelecionados([])} className="text-sm text-red-600 hover:underline">
                Limpar combinação
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
