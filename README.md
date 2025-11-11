# CineStream - Plataforma de Filmes

Uma aplicação moderna para descobrir e assistir filmes usando React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- 🎬 Catálogo de filmes usando TMDB API
- 🔍 Busca e filtros por gênero
- 📺 Player integrado com Peelink
- 🎯 Informações detalhadas dos filmes
- 📱 Design responsivo
- 🌙 Suporte a tema escuro

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- Supabase (Edge Functions)
- TMDB API
- OMDb API

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Conta no TMDB (https://www.themoviedb.org/)
3. Conta no OMDb (http://www.omdbapi.com/)
4. Conta no Supabase (https://supabase.com/)

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
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_supabase
```

### 3. Configure o Supabase

#### 3.1. Obtenha suas credenciais do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### 3.2. Configure o Project ID

1. Vá em **Settings** → **General**
2. Copie o **Reference ID** (exemplo: `abcdefghijklmnopqrst`)
3. Edite o arquivo `supabase/config.toml`:

```toml
[project]
project_id = "seu_reference_id_aqui"
```

#### 3.3. Faça login no Supabase CLI

```bash
npx supabase login
```

#### 3.4. Link o projeto local com o Supabase

```bash
npx supabase link --project-ref seu_reference_id_aqui
```

#### 3.5. Deploy da Edge Function

```bash
npx supabase functions deploy scrape-peelink
```

### 4. Inicie o servidor de desenvolvimento

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

## 🐛 Troubleshooting

### Edge Function não funciona

1. Verifique se o `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos no `.env`
2. Verifique se a Edge Function foi deployada:
   ```bash
   npx supabase functions list
   ```
3. Veja os logs da função:
   ```bash
   npx supabase functions logs scrape-peelink
   ```

### Players não carregam

1. Verifique se a Edge Function está funcionando
2. Abra o console do navegador (F12) e veja os erros
3. Tente abrir a página completa do Peelink clicando no botão correspondente

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.