const API_BASE_URL = 'http://appservidor.erremepe.com:80/ajax/appv/appv2_2_0_10.php';
const API_VERSION = '9.9.95';

export interface CustomMovie {
  id: string;
  titulo: string;
  ano: string;
  genero: string[];
  nota: number;
  duracao: string;
  imagem: string;
  imagemFundo?: string;
  descricao: string;
  diretor?: string;
  elenco?: string[];
  link?: string;
  qualidade?: string;
  idioma?: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  slug: string;
  apiSlug: string;
}

export const customCategories: CustomCategory[] = [
  { id: '1', name: 'Todos', slug: 'all', apiSlug: '' },
  { id: '2', name: 'Ação', slug: 'acao', apiSlug: 'categoria-acao' },
  { id: '3', name: 'Animação', slug: 'animacao', apiSlug: 'categoria-animacao' },
  { id: '4', name: 'Drama', slug: 'drama', apiSlug: 'categoria-drama' },
  { id: '5', name: 'Romance', slug: 'romance', apiSlug: 'categoria-romance' },
  { id: '6', name: 'Guerra', slug: 'guerra', apiSlug: 'categoria-guerra' },
  { id: '7', name: 'Ficção Científica', slug: 'ficcao', apiSlug: 'categoria-ficcaocientifica' },
  { id: '8', name: 'Aventura', slug: 'aventura', apiSlug: 'categoria-aventura' },
  { id: '9', name: 'Comédia', slug: 'comedia', apiSlug: 'categoria-comedia' },
  { id: '10', name: 'Fantasia', slug: 'fantasia', apiSlug: 'categoria-fantasia' },
  { id: '11', name: 'Thriller', slug: 'thriller', apiSlug: 'categoria-thriller' },
];

export const customApiService = {
  // Buscar filmes por categoria
  async getMoviesByCategory(categorySlug: string, page: number = 1): Promise<{ results: CustomMovie[]; total_pages: number }> {
    try {
      const category = customCategories.find(c => c.apiSlug === categorySlug);
      
      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      const url = `${API_BASE_URL}?v=${API_VERSION}&tipo=categoria&nome=${categorySlug}&pagina=${page}&hwid=null`;
      
      console.log('Buscando filmes da categoria:', category.name, 'URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Resposta da API:', data);

      // Adaptar a resposta da API para o formato esperado
      const movies = this.parseMoviesFromResponse(data);
      
      return {
        results: movies,
        total_pages: data.total_pages || 1,
      };
    } catch (error) {
      console.error('Erro ao buscar filmes por categoria:', error);
      throw error;
    }
  },

  // Buscar todos os filmes (página inicial)
  async getAllMovies(page: number = 1): Promise<{ results: CustomMovie[]; total_pages: number }> {
    try {
      // Buscar filmes de ação como padrão para "Todos"
      return await this.getMoviesByCategory('categoria-acao', page);
    } catch (error) {
      console.error('Erro ao buscar todos os filmes:', error);
      throw error;
    }
  },

  // Buscar filme por ID
  async getMovieById(movieId: string): Promise<CustomMovie | null> {
    try {
      const url = `${API_BASE_URL}?v=${API_VERSION}&tipo=detalhes&id=${movieId}&hwid=null`;
      
      console.log('Buscando detalhes do filme:', movieId, 'URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Detalhes do filme:', data);

      return this.parseMovieDetails(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string, page: number = 1): Promise<{ results: CustomMovie[]; total_pages: number }> {
    try {
      const url = `${API_BASE_URL}?v=${API_VERSION}&tipo=busca&query=${encodeURIComponent(query)}&pagina=${page}&hwid=null`;
      
      console.log('Buscando filmes:', query, 'URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Resultados da busca:', data);

      const movies = this.parseMoviesFromResponse(data);
      
      return {
        results: movies,
        total_pages: data.total_pages || 1,
      };
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }
  },

  // Parsear resposta da API para o formato CustomMovie
  parseMoviesFromResponse(data: any): CustomMovie[] {
    if (!data || !Array.isArray(data.filmes) && !Array.isArray(data.results) && !Array.isArray(data)) {
      console.warn('Formato de resposta inesperado:', data);
      return [];
    }

    const moviesArray = data.filmes || data.results || data;

    return moviesArray.map((movie: any, index: number) => ({
      id: movie.id || movie.ID || `movie-${index}`,
      titulo: movie.titulo || movie.nome || movie.title || 'Sem título',
      ano: movie.ano || movie.year || 'N/A',
      genero: this.parseGenres(movie.genero || movie.categoria || movie.genre),
      nota: this.parseRating(movie.nota || movie.rating || movie.imdb),
      duracao: movie.duracao || movie.duration || 'N/A',
      imagem: movie.imagem || movie.poster || movie.capa || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      imagemFundo: movie.imagemFundo || movie.backdrop || movie.background,
      descricao: movie.descricao || movie.sinopse || movie.description || 'Sem descrição disponível',
      diretor: movie.diretor || movie.director,
      elenco: this.parseCast(movie.elenco || movie.cast),
      link: movie.link || movie.url || movie.player,
      qualidade: movie.qualidade || movie.quality || 'HD',
      idioma: movie.idioma || movie.language || 'Dublado',
    }));
  },

  // Parsear detalhes do filme
  parseMovieDetails(data: any): CustomMovie | null {
    if (!data) return null;

    return {
      id: data.id || data.ID || 'unknown',
      titulo: data.titulo || data.nome || data.title || 'Sem título',
      ano: data.ano || data.year || 'N/A',
      genero: this.parseGenres(data.genero || data.categoria || data.genre),
      nota: this.parseRating(data.nota || data.rating || data.imdb),
      duracao: data.duracao || data.duration || 'N/A',
      imagem: data.imagem || data.poster || data.capa || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      imagemFundo: data.imagemFundo || data.backdrop || data.background,
      descricao: data.descricao || data.sinopse || data.description || 'Sem descrição disponível',
      diretor: data.diretor || data.director,
      elenco: this.parseCast(data.elenco || data.cast),
      link: data.link || data.url || data.player,
      qualidade: data.qualidade || data.quality || 'HD',
      idioma: data.idioma || data.language || 'Dublado',
    };
  },

  // Parsear gêneros
  parseGenres(genres: any): string[] {
    if (Array.isArray(genres)) return genres;
    if (typeof genres === 'string') return genres.split(',').map(g => g.trim());
    return [];
  },

  // Parsear nota
  parseRating(rating: any): number {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : Math.min(10, Math.max(0, parsed));
  },

  // Parsear elenco
  parseCast(cast: any): string[] {
    if (Array.isArray(cast)) return cast;
    if (typeof cast === 'string') return cast.split(',').map(c => c.trim());
    return [];
  },

  // Converter para formato compatível com o Movie existente
  convertToLocalMovie(customMovie: CustomMovie): any {
    return {
      id: customMovie.id,
      title: customMovie.titulo,
      year: customMovie.ano,
      genre: customMovie.genero,
      rating: customMovie.nota,
      duration: customMovie.duracao,
      image: customMovie.imagem,
      backdrop: customMovie.imagemFundo,
      description: customMovie.descricao,
      director: customMovie.diretor || 'N/A',
      cast: customMovie.elenco || [],
      link: customMovie.link,
      quality: customMovie.qualidade,
      language: customMovie.idioma,
    };
  },
};