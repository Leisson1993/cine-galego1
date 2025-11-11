// Usar proxy local em desenvolvimento, URL direta em produção
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/appv2_2_0_10.php'
  : 'http://appservidor.erremepe.com:80/ajax/appv/appv2_2_0_10.php';

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
      
      console.log('🔍 Buscando filmes da categoria:', category.name);
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ Resposta da API:', data);
      console.log(`📦 Total de filmes: ${Array.isArray(data) ? data.length : 0}`);

      // A API retorna um array direto
      const movies = this.parseMoviesFromResponse(data);
      
      return {
        results: movies,
        total_pages: 1, // A API não retorna paginação, então assumimos 1 página
      };
    } catch (error) {
      console.error('❌ Erro ao buscar filmes por categoria:', error);
      throw error;
    }
  },

  // Buscar todos os filmes (página inicial)
  async getAllMovies(page: number = 1): Promise<{ results: CustomMovie[]; total_pages: number }> {
    try {
      return await this.getMoviesByCategory('categoria-acao', page);
    } catch (error) {
      console.error('❌ Erro ao buscar todos os filmes:', error);
      throw error;
    }
  },

  // Buscar filme por ID
  async getMovieById(movieId: string): Promise<CustomMovie | null> {
    try {
      const url = `${API_BASE_URL}?v=${API_VERSION}&tipo=detalhes&id=${movieId}&hwid=null`;
      
      console.log('🔍 Buscando detalhes do filme:', movieId);
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ Detalhes do filme:', data);

      return this.parseMovieDetails(data);
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do filme:', error);
      return null;
    }
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string, page: number = 1): Promise<{ results: CustomMovie[]; total_pages: number }> {
    try {
      const url = `${API_BASE_URL}?v=${API_VERSION}&tipo=busca&query=${encodeURIComponent(query)}&pagina=${page}&hwid=null`;
      
      console.log('🔍 Buscando filmes:', query);
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ Resultados da busca:', data);

      const movies = this.parseMoviesFromResponse(data);
      
      return {
        results: movies,
        total_pages: 1,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar filmes:', error);
      throw error;
    }
  },

  // Parsear resposta da API para o formato CustomMovie
  parseMoviesFromResponse(data: any): CustomMovie[] {
    if (!Array.isArray(data)) {
      console.warn('⚠️ Resposta não é um array:', data);
      return [];
    }

    console.log(`📦 Parseando ${data.length} filmes`);

    return data.map((movie: any, index: number) => {
      // A API retorna: id, nome, imagem, imagem_original, tipo, temporadas, total_filme, versao_config
      const parsed = {
        id: movie.id || `movie-${index}`,
        titulo: movie.nome || movie.titulo || movie.title || 'Sem título',
        ano: movie.ano || movie.year || '2024', // A API não retorna ano, usar padrão
        genero: this.parseGenres(movie.genero || movie.categoria || movie.tipo || 'Ação'),
        nota: this.parseRating(movie.nota || movie.rating || 7.5), // Nota padrão
        duracao: movie.duracao || movie.duration || '2h',
        imagem: movie.imagem_original || movie.imagem || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
        imagemFundo: movie.imagem_original || movie.imagem,
        descricao: movie.descricao || movie.sinopse || movie.description || 'Sem descrição disponível',
        diretor: movie.diretor || movie.director || 'N/A',
        elenco: this.parseCast(movie.elenco || movie.cast),
        link: movie.link || movie.url,
        qualidade: movie.qualidade || movie.quality || 'HD',
        idioma: movie.tipo || movie.idioma || 'DUB',
      };
      
      console.log(`✅ Filme parseado: ${parsed.titulo}`);
      return parsed;
    });
  },

  // Parsear detalhes do filme
  parseMovieDetails(data: any): CustomMovie | null {
    if (!data) return null;

    // Se for um array, pegar o primeiro item
    const movieData = Array.isArray(data) ? data[0] : data;

    return {
      id: movieData.id || 'unknown',
      titulo: movieData.nome || movieData.titulo || movieData.title || 'Sem título',
      ano: movieData.ano || movieData.year || '2024',
      genero: this.parseGenres(movieData.genero || movieData.categoria || movieData.tipo || 'Ação'),
      nota: this.parseRating(movieData.nota || movieData.rating || 7.5),
      duracao: movieData.duracao || movieData.duration || '2h',
      imagem: movieData.imagem_original || movieData.imagem || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      imagemFundo: movieData.imagem_original || movieData.imagem,
      descricao: movieData.descricao || movieData.sinopse || movieData.description || 'Sem descrição disponível',
      diretor: movieData.diretor || movieData.director || 'N/A',
      elenco: this.parseCast(movieData.elenco || movieData.cast),
      link: movieData.link || movieData.url,
      qualidade: movieData.qualidade || movieData.quality || 'HD',
      idioma: movieData.tipo || movieData.idioma || 'DUB',
    };
  },

  // Parsear gêneros
  parseGenres(genres: any): string[] {
    if (Array.isArray(genres)) {
      return genres.map(g => typeof g === 'string' ? g : g.name || g.nome || '').filter(Boolean);
    }
    if (typeof genres === 'string') {
      return genres.split(',').map(g => g.trim()).filter(Boolean);
    }
    return ['Ação']; // Gênero padrão
  },

  // Parsear nota
  parseRating(rating: any): number {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 7.5 : Math.min(10, Math.max(0, parsed));
  },

  // Parsear elenco
  parseCast(cast: any): string[] {
    if (Array.isArray(cast)) {
      return cast.map(c => typeof c === 'string' ? c : c.name || c.nome || '').filter(Boolean);
    }
    if (typeof cast === 'string') {
      return cast.split(',').map(c => c.trim()).filter(Boolean);
    }
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