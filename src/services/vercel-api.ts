// Usar proxy local em desenvolvimento, URL direta em produção
const VERCEL_API_BASE_URL = import.meta.env.DEV 
  ? '/api/filmes'
  : 'https://apifilmes-wheat.vercel.app/filmes';

const API_KEY = '83a1bf1e-bbb3-4873-ae5c-3c0113794ea1';

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
    const url = `${VERCEL_API_BASE_URL}?apiKey=${API_KEY}`;
    
    console.log('🔍 Buscando filmes via proxy...');
    console.log('📡 URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Resposta recebida! Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Erro desconhecido');
        console.error('❌ Erro na resposta:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ JSON parseado!');
      console.log('📦 Tipo de dados:', typeof data, 'É array?', Array.isArray(data));
      
      // Log do primeiro item para debug
      if (Array.isArray(data) && data.length > 0) {
        console.log('📦 Primeiro filme (raw):', JSON.stringify(data[0], null, 2));
      }

      // Verificar o formato da resposta
      let movies: any[] = [];
      
      if (Array.isArray(data)) {
        movies = data;
      } else if (data.results && Array.isArray(data.results)) {
        movies = data.results;
      } else if (data.movies && Array.isArray(data.movies)) {
        movies = data.movies;
      } else if (data.filmes && Array.isArray(data.filmes)) {
        movies = data.filmes;
      } else if (data.data && Array.isArray(data.data)) {
        movies = data.data;
      } else {
        console.error('❌ Formato desconhecido:', Object.keys(data));
        throw new Error('Formato de dados não reconhecido');
      }

      console.log(`📦 Total de filmes encontrados: ${movies.length}`);

      if (movies.length === 0) {
        console.warn('⚠️ Nenhum filme encontrado');
        return { results: [], total: 0 };
      }

      const parsedMovies = movies.map((movie, index) => {
        const parsed = this.parseMovie(movie);
        if (index === 0) {
          console.log('📦 Primeiro filme (parseado):', JSON.stringify(parsed, null, 2));
        }
        return parsed;
      });
      
      console.log(`✅ ${parsedMovies.length} filmes parseados com sucesso!`);
      
      return {
        results: parsedMovies,
        total: parsedMovies.length,
      };
    } catch (error) {
      console.error('❌ ERRO:', error);
      throw error;
    }
  },

  // Buscar filmes por categoria
  async getMoviesByCategory(categorySlug: string): Promise<{ results: VercelMovie[]; total: number }> {
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

      console.log(`🔍 Categoria "${categorySlug}": ${filtered.length} filmes`);

      return {
        results: filtered,
        total: filtered.length,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar por categoria:', error);
      throw error;
    }
  },

  // Buscar filme por ID
  async getMovieById(movieId: string): Promise<VercelMovie | null> {
    try {
      console.log('🔍 Buscando filme ID:', movieId);
      const allMovies = await this.getAllMovies();
      const movie = allMovies.results.find(m => m.id === movieId);
      
      if (movie) {
        console.log('✅ Filme encontrado:', movie.title);
        return movie;
      }
      
      console.warn('⚠️ Filme não encontrado');
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar filme:', error);
      return null;
    }
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string): Promise<{ results: VercelMovie[]; total: number }> {
    try {
      console.log('🔍 Buscando:', query);
      const allMovies = await this.getAllMovies();
      
      const queryLower = query.toLowerCase();
      const filtered = allMovies.results.filter(movie => {
        const titleMatch = movie.title?.toLowerCase().includes(queryLower);
        const descriptionMatch = movie.description?.toLowerCase().includes(queryLower);
        const genreMatch = movie.genre?.some(g => g.toLowerCase().includes(queryLower));
        
        return titleMatch || descriptionMatch || genreMatch;
      });
      
      console.log(`✅ ${filtered.length} resultados para "${query}"`);
      
      return {
        results: filtered,
        total: filtered.length,
      };
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw error;
    }
  },

  // Parsear filme - MELHORADO para aceitar mais formatos
  parseMovie(data: any): VercelMovie {
    if (!data) return this.getDefaultMovie();

    // Tentar extrair ID de várias formas possíveis
    const id = String(
      data.id || 
      data._id || 
      data.imdbID || 
      data.movieId ||
      data.idFilme ||
      `movie-${Date.now()}-${Math.random()}`
    );

    // Tentar extrair título de várias formas
    const title = 
      data.title || 
      data.name || 
      data.titulo || 
      data.nome || 
      data.Title || 
      data.nomeFilme ||
      'Sem título';

    // Tentar extrair imagem de várias formas
    const image = 
      data.image || 
      data.poster || 
      data.poster_path || 
      data.imagem || 
      data.imagem_original || 
      data.Poster ||
      data.capa ||
      data.thumbnail ||
      data.img ||
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop';

    // Tentar extrair backdrop
    const backdrop = 
      data.backdrop || 
      data.backdrop_path || 
      data.imagemFundo || 
      data.background ||
      image;

    // Tentar extrair link do player
    const link = 
      data.link || 
      data.url || 
      data.player || 
      data.stream_url || 
      data.video ||
      data.playerUrl ||
      data.streamUrl;

    const parsed = {
      id,
      title,
      year: data.year || data.ano || data.Year || data.release_date?.split('-')[0] || '2024',
      genre: this.parseGenres(data.genre || data.genres || data.genero || data.categoria || data.Genre),
      rating: this.parseRating(data.rating || data.vote_average || data.nota || data.imdb || data.imdbRating),
      duration: data.duration || data.runtime || data.duracao || data.Runtime || '2h',
      image,
      backdrop,
      description: data.description || data.overview || data.descricao || data.sinopse || data.Plot || 'Sem descrição disponível',
      director: data.director || data.diretor || data.Director || 'N/A',
      cast: this.parseCast(data.cast || data.actors || data.elenco || data.Actors),
      link,
      quality: data.quality || data.qualidade || 'HD',
      language: data.language || data.idioma || data.tipo || data.Language || 'DUB',
    };

    return parsed;
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