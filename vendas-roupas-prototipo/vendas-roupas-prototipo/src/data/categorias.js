export const CATEGORIAS = [
  { id: 'sobretudo', label: 'Sobretudo', exemplo: 'Casacos, jaquetas, blazers', opcional: true },
  { id: 'dorso', label: 'Dorso', exemplo: 'Camisetas, camisas, vestidos' },
  { id: 'perna', label: 'Perna', exemplo: 'Calças, bermudas, saias' },
  { id: 'pe', label: 'Pé', exemplo: 'Tênis, botas, sapatos' },
]

export const rotuloCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.label ?? '—'
