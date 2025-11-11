# CINE-GALEGO - Plataforma de Filmes, Séries e Animes 🎬

Uma aplicação moderna PWA (Progressive Web App) para descobrir e assistir filmes, séries e animes usando React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- 🎬 Catálogo de filmes usando API Vercel
- 📺 Séries com temporadas e episódios
- ✨ Animes com temporadas e episódios
- 🔍 Busca e filtros por gênero
- 📱 Design responsivo
- 🌙 Tema escuro/claro
- 🎯 Informações detalhadas dos filmes
- 🎮 Player integrado com múltiplos servidores

## 📱 PWA - Progressive Web App

O CINE-GALEGO é um PWA completo com:

### ✅ Instalável
- Pode ser instalado no celular/computador
- Aparece na tela inicial como app nativo
- Não precisa de loja de apps

### ⚡ Rápido
- Cache inteligente
- Carregamento instantâneo
- Menos consumo de dados

### 🔌 Funciona Offline
- Continua funcionando sem internet
- Cache automático de páginas visitadas
- Sincroniza quando volta online

### 🔔 Notificações
- Suporte a notificações push (futuro)
- Alertas de novos conteúdos

### 🎨 Experiência Nativa
- Tela cheia sem barra do navegador
- Splash screen personalizada
- Ícone na tela inicial

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TMDB API
- OMDb API
- Service Worker
- Web App Manifest

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

**Importante:** Para o PWA funcionar corretamente em produção, você precisa:
- Servir o app via HTTPS
- Ter o Service Worker registrado
- Ter o manifest.json acessível

## 🔧 Comandos úteis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📱 Como instalar o PWA

### No Android (Chrome):
1. Abra o site no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### No iOS (Safari):
1. Abra o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme

### No Desktop (Chrome/Edge):
1. Abra o site
2. Clique no ícone de instalação na barra de endereço
3. Ou vá em Menu > Instalar CINE-GALEGO

## 🎨 Tema

O CINE-GALEGO suporta tema escuro e claro. Use o botão no canto superior direito para alternar entre os temas.

## 🔒 Segurança

- HTTPS obrigatório para PWA
- Service Worker com cache seguro
- Validação de requisições

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 🎯 Roadmap

- [x] PWA completo
- [x] Instalação na tela inicial
- [x] Funcionamento offline
- [x] Cache inteligente
- [ ] Notificações push
- [ ] Sincronização em background
- [ ] Compartilhamento nativo
- [ ] Modo picture-in-picture