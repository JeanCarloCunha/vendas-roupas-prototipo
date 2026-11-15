import { getAll } from '../../services/storage'
import ProdutoCard from '../../components/ProdutoCard'

export default function Produtos() {
  const produtos = getAll('produtos')

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </section>
  )
}
