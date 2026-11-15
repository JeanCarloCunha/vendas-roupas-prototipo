import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à loja</h1>
      <p className="text-gray-600 mb-6">Monte seu look no provador virtual antes de comprar.</p>
      <Link to="/produtos" className="bg-indigo-600 text-white px-5 py-2 rounded">Ver produtos</Link>
    </section>
  )
}
