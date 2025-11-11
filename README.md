# CINE-GALEGO - Plataforma de Filmes, Séries e Animes

Uma aplicação moderna para descobrir e assistir filmes, séries e animes usando React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- 🎬 Catálogo de filmes usando API Vercel
- 📺 Séries com temporadas e episódios
- ✨ Animes com temporadas e episódios
- 🔍 Busca e filtros por gênero
- 📱 Design responsivo
- 🌙 Tema escuro/claro
- 🎯 Informações detalhadas dos filmes
- 🎮 Player integrado com múltiplos servidores

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TMDB API
- OMDb API

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Conta no TMDB (https://www.themoviedb.org/)
3. Conta no OMDb (http://www.omdbapi.com/)

## ⚙️ Configuração

### 1. Clone o repositório e instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas chaves de API:

```env
VITE_TMDB_API_KEY=sua_chave_tmdb
VITE_OMDB_API_KEY=sua_chave_omdb
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

## 📦 Build para produção

```bash
npm run build
```

## 🔧 Comandos úteis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🎨 Tema

O CINE-GALEGO suporta tema escuro e claro. Use o botão no canto superior direito para alternar entre os temas.

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.