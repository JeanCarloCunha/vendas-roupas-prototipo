# Vendas de Roupas – Protótipo (Trabalho Final N3)

Protótipo web de loja de roupas com **provador virtual de looks**.
Disciplina: Análise, Projeto e Desenvolvimento Ágil – Católica SC.

## Stack
React + Vite · Tailwind CSS · React Router · lucide-react · localStorage (banco do protótipo) · Vercel

## Rodar localmente
```bash
npm install
npm run dev
```

## Login de teste (admin)
`admin@loja.com` / `admin123`

## Requisitos
RF01 Cadastro/login · RF02 Cadastro de produtos · RF03 Lista de produtos · RF04 Carrinho · RF05 Checkout ·
RF06 Histórico · RF07–RF10 Provador virtual (selecionar, combinar, sugestões, favoritos)

## Provador virtual
- **Categorias de peça:** dorso, perna, pé e sobretudo (opcional). O admin escolhe a categoria ao cadastrar o produto.
- **Montar look (RF07/RF08):** uma peça por categoria. O vestido é peça única e cobre dorso e perna.
- **Sugestões (RF09):** completam as peças já escolhidas, ordenadas por harmonia de cores (neutros combinam com tudo, duas cores fortes diferentes pontuam baixo). Regra em `src/services/sugestoes.js`.
- **Favoritos (RF10):** o cliente logado salva o look com um nome, abre no provador, exclui ou adiciona ao carrinho.

## Navegação
`/` redireciona para `/produtos`.

## Documentação
Diagramas UML e modelo de dados em `/docs`.
