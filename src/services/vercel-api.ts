const VERCEL_API_BASE_URL = 'https://404a7d91f61faae34a99c0b58d9a05ba88e.vercel.app';

export interface VercelMovie {
  id: string;
  title: string;
  year?: string;
  genre?: string[];
  rating?: number;
  duration?: string;
  image?: string;
  backdrop?: string;
  description?: string;
  director?: string;
  cast?: string[];
  link?: string;
  quality?: string;
  language?: string;
  [key: string]: any;
}

export interface VercelCategory {
  id: string;
  name: string;
  slug: string;
}

export const vercelCategories: VercelCategory[] = [
  { id: '1', name: 'Todos', slug: 'all' },
  { id: '2', name: 'Ação', slug: 'action' },
  { id: '3', name: 'Animação', slug: 'animation' },
  { id: '4', name: 'Drama', slug: 'drama' },
  { id: '5', name: 'Romance', slug: 'romance' },
  { id: '6', name: 'Comédia', slug: 'comedy' },
  { id: '7', name: 'Ficção Científica', slug: 'scifi' },
  { id: '8', name: 'Terror', slug: 'horror' },
  { id: '9', name: 'Aventura', slug: 'adventure' },
  { id: '10', name: 'Fantasia', slug: 'fantasy' },
  { id: '11', name: 'Thriller', slug: 'thriller' },
];

export const vercelApiService = {
  // Buscar todos os filmes
  async getAllMovies(): Promise<{ results: VercelMovie[]; total: number }> {
    try {
      const url = `${VERCEL_API_BASE_URL}/all`;
      
      console.log('🔍 Buscando todos os filmes da Vercel API');
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
      
      console.log('✅ Resposta da Vercel API:', data);
      console.log(`📦 Total de filmes: ${Array.isArray(data) ? data.length : data.results?.length || 0}`);

      // Verificar o formato da resposta
      let movies: VercelMovie[] = [];
      
      if (Array.isArray(data)) {
        movies = data;
      } else if (data.results && Array.isArray(data.results)) {
        movies = data.results;
      } else if (data.movies && Array.isArray(data.movies)) {
        movies = data.movies;
      } else {
        console.warn('⚠️ Formato de resposta desconhecido:', data);
        return { results: [], total: 0 };
      }

      const parsedMovies = movies.map(movie => this.parseMovie(movie));
      
      return {
        results: parsedMovies,
        total: parsedMovies.length,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar filmes da Vercel API:', error);
      throw error;
    }
  },

  // Buscar filmes por categoria
  async getMoviesByCategory(categorySlug: string): Promise<{ results: VercelMovie[]; total: number }> {
    try {
      // Primeiro buscar todos os filmes
      const allMovies = await this.getAllMovies();
      
      if (categorySlug === 'all' || !categorySlug) {
        return allMovies;
      }

      // Filtrar por categoria
      const filtered = allMovies.results.filter(movie => {
        if (!movie.genre || !Array.isArray(movie.genre)) return false;
        
        const genreLower = movie.genre.map(g => g.toLowerCase());
        return genreLower.some(g => g.includes(categorySlug.toLowerCase()));
      });

      console.log(`🔍 Filmes filtrados por categoria "${categorySlug}": ${filtered.length}`);

      return {
        results: filtered,
        total: filtered.length,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar filmes por categoria:', error);
      throw error;
    }
  },

  // Buscar filme por ID
  async getMovieById(movieId: string): Promise<VercelMovie | null> {
    try {
      const url = `${VERCEL_API_BASE_URL}/movie/${movieId}`;
      
      console.log('🔍 Buscando detalhes do filme ID:', movieId);
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Se não houver endpoint específico, buscar na lista completa
        console.log('⚠️ Endpoint de detalhes não disponível, buscando na lista completa');
        const allMovies = await this.getAllMovies();
        const movie = allMovies.results.find(m => m.id === movieId);
        return movie || null;
      }

      const data = await response.json();
      
      console.log('✅ Detalhes do filme:', data);

      return this.parseMovie(data);
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do filme:', error);
      
      // Fallback: buscar na lista completa
      try {
        const allMovies = await this.getAllMovies();
        const movie = allMovies.results.find(m => m.id === movieId);
        return movie || null;
      } catch {
        return null;
      }
    }
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string): Promise<{ results: VercelMovie[]; total: number }> {
    try {
      const url = `${VERCEL_API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
      
      console.log('🔍 Buscando filmes:', query);
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Se não houver endpoint de busca, filtrar localmente
        console.log('⚠️ Endpoint de busca não disponível, filtrando localmente');
        const allMovies = await this.getAllMovies();
        const filtered = allMovies.results.filter(movie => 
          movie.title?.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
          results: filtered,
          total: filtered.length,
        };
      }

      const data = await response.json();
      
      console.log('✅ Resultados da busca:', data);

      let movies: VercelMovie[] = [];
      
      if (Array.isArray(data)) {
        movies = data;
      } else if (data.results && Array.isArray(data.results)) {
        movies = data.results;
      }

      const parsedMovies = movies.map(movie => this.parseMovie(movie));

      return {
        results: parsedMovies,
        total: parsedMovies.length,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar filmes:', error);
      throw error;
    }
  },

  // Parsear filme para formato padrão
  parseMovie(data: any): VercelMovie {
    if (!data) return this.getDefaultMovie();

    return {
      id: data.id || data._id || `movie-${Date.now()}`,
      title: data.title || data.name || data.titulo || data.nome || 'Sem título',
      year: data.year || data.ano || data.release_date?.split('-')[0] || '2024',
      genre: this.parseGenres(data.genre || data.genres || data.genero || data.categoria),
      rating: this.parseRating(data.rating || data.vote_average || data.nota || data.imdb),
      duration: data.duration || data.runtime || data.duracao || '2h',
      image: data.image || data.poster || data.poster_path || data.imagem || data.imagem_original || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      backdrop: data.backdrop || data.backdrop_path || data.imagemFundo || data.image,
      description: data.description || data.overview || data.descricao || data.sinopse || 'Sem descrição disponível',
      director: data.director || data.diretor || 'N/A',
      cast: this.parseCast(data.cast || data.actors || data.elenco),
      link: data.link || data.url || data.player || data.stream_url,
      quality: data.quality || data.qualidade || 'HD',
      language: data.language || data.idioma || data.tipo || 'DUB',
    };
  },

  // Parsear gêneros
  parseGenres(genres: any): string[] {
    if (Array.isArray(genres)) {
      return genres.map(g => {
        if (typeof g === 'string') return g;
        if (g.name) return g.name;
        if (g.nome) return g.nome;
        return '';
      }).filter(Boolean);
    }
    if (typeof genres === 'string') {
      return genres.split(',').map(g => g.trim()).filter(Boolean);
    }
    return ['Ação'];
  },

  // Parsear nota
  parseRating(rating: any): number {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 7.5 : Math.min(10, Math.max(0, parsed));
  },

  // Parsear elenco
  parseCast(cast: any): string[] {
    if (Array.isArray(cast)) {
      return cast.map(c => {
        if (typeof c === 'string') return c;
        if (c.name) return c.name;
        if (c.nome) return c.nome;
        return '';
      }).filter(Boolean);
    }
    if (typeof cast === 'string') {
      return cast.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  },

  // Filme padrão
  getDefaultMovie(): VercelMovie {
    return {
      id: 'unknown',
      title: 'Sem título',
      year: '2024',
      genre: ['Ação'],
      rating: 7.5,
      duration: '2h',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      description: 'Sem descrição disponível',
      director: 'N/A',
      cast: [],
    };
  },

  // Converter para formato compatível
  convertToLocalMovie(vercelMovie: VercelMovie): any {
    return {
      id: vercelMovie.id,
      title: vercelMovie.title,
      year: vercelMovie.year,
      genre: vercelMovie.genre,
      rating: vercelMovie.rating,
      duration: vercelMovie.duration,
      image: vercelMovie.image,
      backdrop: vercelMovie.backdrop,
      description: vercelMovie.description,
      director: vercelMovie.director,
      cast: vercelMovie.cast,
      link: vercelMovie.link,
      quality: vercelMovie.quality,
      language: vercelMovie.language,
    };
  },
};