import { useState } from 'react'
import { getAll, insert } from '../../services/storage'

const VAZIO = { nome: '', tamanho: '', cor: '', preco: '', imagem_url: '' }

export default function AdminProdutos() {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [produtos, setProdutos] = useState(getAll('produtos'))

  const atualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function salvar(e) {
    e.preventDefault()
    setSucesso('')
    const preco = Number(String(form.preco).replace(',', '.'))
    if (!form.nome.trim() || !form.tamanho.trim() || !form.cor.trim()) {
      return setErro('Preencha nome, tamanho e cor.')
    }
    if (!preco || preco <= 0) return setErro('Informe um preço maior que zero.')
    if (!form.imagem_url.trim()) return setErro('Informe a URL da imagem.')

    insert('produtos', {
      nome: form.nome.trim(),
      tamanho: form.tamanho.trim(),
      cor: form.cor.trim(),
      preco,
      imagem_url: form.imagem_url.trim(),
    })
    setProdutos(getAll('produtos'))
    setForm(VAZIO)
    setErro('')
    setSucesso('Produto cadastrado com sucesso!')
  }

  const campo = 'w-full border rounded px-3 py-2'

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Cadastro de produtos</h1>

      <form onSubmit={salvar} className="bg-white border rounded p-4 grid gap-3 max-w-xl mb-8">
        <input className={campo} placeholder="Nome" value={form.nome} onChange={atualizar('nome')} />
        <div className="grid grid-cols-2 gap-3">
          <input className={campo} placeholder="Tamanho (ex.: M, 42)" value={form.tamanho} onChange={atualizar('tamanho')} />
          <input className={campo} placeholder="Cor" value={form.cor} onChange={atualizar('cor')} />
        </div>
        <input className={campo} placeholder="Preço (ex.: 99,90)" value={form.preco} onChange={atualizar('preco')} />
        <input className={campo} placeholder="URL da imagem" value={form.imagem_url} onChange={atualizar('imagem_url')} />
        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}
        <button className="bg-gray-900 text-white rounded py-2 hover:bg-gray-700">Cadastrar produto</button>
      </form>

      <h2 className="font-semibold mb-2">Produtos cadastrados ({produtos.length})</h2>
      <div className="bg-white border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Imagem</th><th className="p-2">Nome</th><th className="p-2">Tamanho</th>
              <th className="p-2">Cor</th><th className="p-2">Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2"><img src={p.imagem_url} alt={p.nome} className="w-10 h-12 object-cover rounded" /></td>
                <td className="p-2">{p.nome}</td>
                <td className="p-2">{p.tamanho}</td>
                <td className="p-2">{p.cor}</td>
                <td className="p-2">R$ {Number(p.preco).toFixed(2).replace('.', ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
