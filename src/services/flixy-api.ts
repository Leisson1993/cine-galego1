const FLIXY_API_BASE_URL = 'https://api-flixy.vercel.app';

export interface FlixyMovie {
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
  videoUrl?: string;
  quality?: string;
  language?: string;
}

export interface FlixyCategory {
  id: string;
  name: string;
  slug: string;
}

export const flixyCategories: FlixyCategory[] = [
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

export const flixyApiService = {
  // Buscar todos os filmes
  async getAllMovies(): Promise<{ results: FlixyMovie[]; total: number }> {
    try {
      const response = await fetch(`${FLIXY_API_BASE_URL}/api/movies`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Referer': FLIXY_API_BASE_URL,
          'Origin': FLIXY_API_BASE_URL,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      const movies = Array.isArray(data) ? data : data.movies || [];
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

  // Buscar filme por ID
  async getMovieById(movieId: string): Promise<FlixyMovie | null> {
    try {
      const response = await fetch(`${FLIXY_API_BASE_URL}/api/movie/${movieId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Referer': FLIXY_API_BASE_URL,
          'Origin': FLIXY_API_BASE_URL,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return this.parseMovie(data);
    } catch (error) {
      console.error('❌ Erro ao buscar filme:', error);
      return null;
    }
  },

  // Buscar URL do vídeo
  async getVideoUrl(movieId: string): Promise<string | null> {
    try {
      // A URL do player é: https://api-flixy.vercel.app/watch?id={movieId}
      return `${FLIXY_API_BASE_URL}/watch?id=${movieId}`;
    } catch (error) {
      console.error('❌ Erro ao buscar URL do vídeo:', error);
      return null;
    }
  },

  // Buscar filmes por categoria
  async getMoviesByCategory(categorySlug: string): Promise<{ results: FlixyMovie[]; total: number }> {
    try {
      const allMovies = await this.getAllMovies();
      
      if (categorySlug === 'all' || !categorySlug) {
        return allMovies;
      }

      const filtered = allMovies.results.filter(movie => {
        if (!movie.genre || !Array.isArray(movie.genre)) return false;
        
        const genreLower = movie.genre.map(g => g.toLowerCase());
        
        const categoryMap: { [key: string]: string[] } = {
          'action': ['ação', 'action'],
          'animation': ['animação', 'animation'],
          'drama': ['drama'],
          'romance': ['romance'],
          'comedy': ['comédia', 'comedy'],
          'scifi': ['ficção científica', 'sci-fi', 'science fiction'],
          'horror': ['terror', 'horror'],
          'adventure': ['aventura', 'adventure'],
          'fantasy': ['fantasia', 'fantasy'],
          'thriller': ['thriller', 'suspense'],
        };
        
        const searchTerms = categoryMap[categorySlug.toLowerCase()] || [categorySlug];
        
        return genreLower.some(g => 
          searchTerms.some(term => g.includes(term.toLowerCase()))
        );
      });

      return {
        results: filtered,
        total: filtered.length,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar por categoria:', error);
      throw error;
    }
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string): Promise<{ results: FlixyMovie[]; total: number }> {
    try {
      const allMovies = await this.getAllMovies();
      
      const queryLower = query.toLowerCase();
      const filtered = allMovies.results.filter(movie => {
        const titleMatch = movie.title?.toLowerCase().includes(queryLower);
        const descriptionMatch = movie.description?.toLowerCase().includes(queryLower);
        const genreMatch = movie.genre?.some(g => g.toLowerCase().includes(queryLower));
        
        return titleMatch || descriptionMatch || genreMatch;
      });

      return {
        results: filtered,
        total: filtered.length,
      };
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw error;
    }
  },

  // Parsear filme
  parseMovie(data: any): FlixyMovie {
    if (!data) return this.getDefaultMovie();

    return {
      id: data.id || data._id || `movie-${Date.now()}`,
      title: data.title || data.titulo || data.name || 'Sem título',
      year: data.year || data.ano || '2024',
      genre: this.parseGenres(data.genre || data.genero || data.genres),
      rating: this.parseRating(data.rating || data.nota || data.imdb),
      duration: data.duration || data.duracao || data.runtime || '2h',
      image: data.image || data.poster || data.capa || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      backdrop: data.backdrop || data.background || data.image,
      description: data.description || data.descricao || data.overview || data.sinopse || 'Sem descrição disponível',
      director: data.director || data.diretor || 'N/A',
      cast: this.parseCast(data.cast || data.elenco || data.actors),
      videoUrl: data.videoUrl || data.video || data.link,
      quality: data.quality || data.qualidade || 'HD',
      language: data.language || data.idioma || 'DUB',
    };
  },

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

  parseRating(rating: any): number {
    if (typeof rating === 'string') {
      rating = rating.replace('IMDb', '').trim();
    }
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 7.5 : Math.min(10, Math.max(0, parsed));
  },

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

  getDefaultMovie(): FlixyMovie {
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

  convertToLocalMovie(flixyMovie: FlixyMovie): any {
    return {
      id: flixyMovie.id,
      title: flixyMovie.title,
      year: flixyMovie.year,
      genre: flixyMovie.genre,
      rating: flixyMovie.rating,
      duration: flixyMovie.duration,
      image: flixyMovie.image,
      backdrop: flixyMovie.backdrop,
      description: flixyMovie.description,
      director: flixyMovie.director,
      cast: flixyMovie.cast,
      link: flixyMovie.videoUrl,
      quality: flixyMovie.quality,
      language: flixyMovie.language,
    };
  },
};