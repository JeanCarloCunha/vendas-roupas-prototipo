export default function ProdutoCard({ produto, children }) {
  return (
    <div className="bg-white border rounded overflow-hidden flex flex-col">
      <img src={produto.imagem_url} alt={produto.nome} className="w-full aspect-[4/5] object-cover" />
      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="font-semibold">{produto.nome}</h3>
        <p className="text-sm text-gray-500">Tam. {produto.tamanho} · {produto.cor}</p>
        <p className="font-bold">R$ {Number(produto.preco).toFixed(2).replace('.', ',')}</p>
        {children && <div className="mt-auto pt-2">{children}</div>}
      </div>
    </div>
  )
}
