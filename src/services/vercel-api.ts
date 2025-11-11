// Usar proxy local em desenvolvimento, URL direta em produção
const VERCEL_API_BASE_URL = import.meta.env.DEV 
  ? '/api/filmes'
  : 'https://apifilmes-wheat.vercel.app/filmes';

const VERCEL_SERIES_BASE_URL = import.meta.env.DEV 
  ? '/api/series'
  : 'https://apifilmes-wheat.vercel.app/series';

const VERCEL_ANIMES_BASE_URL = import.meta.env.DEV 
  ? '/api/animes'
  : 'https://apifilmes-wheat.vercel.app/animes';

const API_KEY = '83a1bf1e-bbb3-4873-ae5c-3c0113794ea1';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration?: string;
  link: string;
  alternativeLinks?: string[];
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
}

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
  alternativeLinks?: string[];
  tmdbId?: string;
  type?: 'movie' | 'series' | 'anime';
  seasons?: Season[];
  totalSeasons?: number;
  totalEpisodes?: number;
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
  // Buscar ID do TMDB pelo título e ano
  async getTMDBId(title: string, year?: string, type: 'movie' | 'tv' = 'movie'): Promise<string | null> {
    if (!TMDB_API_KEY) {
      console.warn('⚠️ TMDB API Key não configurada');
      return null;
    }

    try {
      const searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}`;
      
      console.log('🔍 Buscando TMDB ID para:', title, year, type);
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.error('❌ Erro ao buscar TMDB ID:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const tmdbId = data.results[0].id.toString();
        console.log('✅ TMDB ID encontrado:', tmdbId);
        return tmdbId;
      }
      
      console.warn('⚠️ Nenhum resultado encontrado no TMDB');
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar TMDB ID:', error);
      return null;
    }
  },

  // Buscar temporadas e episódios de uma série/anime
  async getSeasons(seriesId: string, type: 'series' | 'anime' = 'series'): Promise<Season[]> {
    const baseUrl = type === 'anime' ? VERCEL_ANIMES_BASE_URL : VERCEL_SERIES_BASE_URL;
    const url = `${baseUrl}/${seriesId}/temporadas?apiKey=${API_KEY}`;
    
    console.log(`📺 Buscando temporadas de ${type}:`, seriesId);
    console.log('📡 URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('⚠️ Endpoint de temporadas não disponível, gerando temporadas simuladas');
        return this.generateMockSeasons(seriesId, type);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ Nenhuma temporada encontrada, gerando temporadas simuladas');
        return this.generateMockSeasons(seriesId, type);
      }

      console.log(`✅ ${data.length} temporadas encontradas`);
      
      return data.map((season: any, index: number) => ({
        id: season.id || `season-${index + 1}`,
        number: season.numero || season.number || index + 1,
        title: season.titulo || season.title || `Temporada ${index + 1}`,
        episodes: this.parseEpisodes(season.episodios || season.episodes || [], index + 1),
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar temporadas:', error);
      return this.generateMockSeasons(seriesId, type);
    }
  },

  // Gerar temporadas simuladas quando a API não retorna
  generateMockSeasons(seriesId: string, type: 'series' | 'anime'): Season[] {
    const numSeasons = type === 'anime' ? 1 : 3;
    const episodesPerSeason = type === 'anime' ? 12 : 10;
    
    return Array.from({ length: numSeasons }, (_, seasonIndex) => ({
      id: `${seriesId}-season-${seasonIndex + 1}`,
      number: seasonIndex + 1,
      title: `Temporada ${seasonIndex + 1}`,
      episodes: Array.from({ length: episodesPerSeason }, (_, epIndex) => ({
        id: `${seriesId}-s${seasonIndex + 1}e${epIndex + 1}`,
        number: epIndex + 1,
        title: `Episódio ${epIndex + 1}`,
        link: `https://vidsrc.xyz/embed/tv/${seriesId}/${seasonIndex + 1}/${epIndex + 1}`,
        alternativeLinks: [
          `https://vidsrc.xyz/embed/tv/${seriesId}/${seasonIndex + 1}/${epIndex + 1}`,
          `https://vidsrc.to/embed/tv/${seriesId}/${seasonIndex + 1}/${epIndex + 1}`,
          `https://vidsrc.me/embed/tv?tmdb=${seriesId}&season=${seasonIndex + 1}&episode=${epIndex + 1}`,
          `https://www.2embed.cc/embedtv/${seriesId}&s=${seasonIndex + 1}&e=${epIndex + 1}`,
        ],
      })),
    }));
  },

  // Parsear episódios
  parseEpisodes(episodes: any[], seasonNumber: number): Episode[] {
    if (!Array.isArray(episodes)) return [];
    
    return episodes.map((ep: any, index: number) => ({
      id: ep.id || `ep-${seasonNumber}-${index + 1}`,
      number: ep.numero || ep.number || index + 1,
      title: ep.titulo || ep.title || `Episódio ${index + 1}`,
      duration: ep.duracao || ep.duration,
      link: ep.link || ep.url,
      alternativeLinks: ep.links || [],
    }));
  },

  // Buscar todos os filmes
  async getAllMovies(): Promise<{ results: VercelMovie[]; total: number }> {
    const url = `${VERCEL_API_BASE_URL}?apiKey=${API_KEY}`;
    
    console.log('🎬 Buscando FILMES via API...');
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
      console.log('📦 Total de filmes:', data.length);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ Nenhum filme encontrado');
        return { results: [], total: 0 };
      }

      const parsedMovies = await Promise.all(data.map(async (movie, index) => {
        const parsed = await this.parseMovie(movie, 'movie');
        if (index === 0) {
          console.log('📦 Primeiro filme parseado:', parsed);
        }
        return parsed;
      }));
      
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

  // Buscar todas as séries
  async getAllSeries(): Promise<{ results: VercelMovie[]; total: number }> {
    const url = `${VERCEL_SERIES_BASE_URL}?apiKey=${API_KEY}`;
    
    console.log('📺 Buscando SÉRIES via API...');
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
      console.log('📦 Total de séries:', data.length);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ Nenhuma série encontrada');
        return { results: [], total: 0 };
      }

      const parsedSeries = await Promise.all(data.map(async (serie, index) => {
        const parsed = await this.parseMovie(serie, 'series');
        if (index === 0) {
          console.log('📦 Primeira série parseada:', parsed);
        }
        return parsed;
      }));
      
      console.log(`✅ ${parsedSeries.length} séries parseadas com sucesso!`);
      
      return {
        results: parsedSeries,
        total: parsedSeries.length,
      };
    } catch (error) {
      console.error('❌ ERRO:', error);
      throw error;
    }
  },

  // Buscar todos os animes
  async getAllAnimes(): Promise<{ results: VercelMovie[]; total: number }> {
    const url = `${VERCEL_ANIMES_BASE_URL}?apiKey=${API_KEY}`;
    
    console.log('✨ Buscando ANIMES via API...');
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
      console.log('📦 Total de animes:', data.length);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ Nenhum anime encontrado');
        return { results: [], total: 0 };
      }

      const parsedAnimes = await Promise.all(data.map(async (anime, index) => {
        const parsed = await this.parseMovie(anime, 'anime');
        if (index === 0) {
          console.log('📦 Primeiro anime parseado:', parsed);
        }
        return parsed;
      }));
      
      console.log(`✅ ${parsedAnimes.length} animes parseados com sucesso!`);
      
      return {
        results: parsedAnimes,
        total: parsedAnimes.length,
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

  // Buscar filme/série/anime por ID
  async getMovieById(movieId: string): Promise<VercelMovie | null> {
    try {
      console.log('🔍 Buscando conteúdo ID:', movieId);
      
      // Tentar buscar em filmes
      const allMovies = await this.getAllMovies();
      let content = allMovies.results.find(m => m.id === movieId);
      
      if (content) {
        console.log('✅ Filme encontrado:', content.title);
        return content;
      }
      
      // Tentar buscar em séries
      const allSeries = await this.getAllSeries();
      content = allSeries.results.find(m => m.id === movieId);
      
      if (content) {
        console.log('✅ Série encontrada:', content.title);
        // Buscar temporadas
        const seasons = await this.getSeasons(content.tmdbId || movieId, 'series');
        content.seasons = seasons;
        content.totalSeasons = seasons.length;
        content.totalEpisodes = seasons.reduce((acc, s) => acc + s.episodes.length, 0);
        return content;
      }
      
      // Tentar buscar em animes
      const allAnimes = await this.getAllAnimes();
      content = allAnimes.results.find(m => m.id === movieId);
      
      if (content) {
        console.log('✅ Anime encontrado:', content.title);
        // Buscar temporadas
        const seasons = await this.getSeasons(content.tmdbId || movieId, 'anime');
        content.seasons = seasons;
        content.totalSeasons = seasons.length;
        content.totalEpisodes = seasons.reduce((acc, s) => acc + s.episodes.length, 0);
        return content;
      }
      
      console.warn('⚠️ Conteúdo não encontrado');
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar conteúdo:', error);
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

  // Gerar múltiplos links alternativos de embed com TMDB ID
  generateEmbedLinks(tmdbId: string, type: 'movie' | 'tv' = 'movie'): string[] {
    if (type === 'tv') {
      return [
        `https://vidsrc.xyz/embed/tv/${tmdbId}`,
        `https://vidsrc.to/embed/tv/${tmdbId}`,
        `https://vidsrc.me/embed/tv?tmdb=${tmdbId}`,
        `https://www.2embed.cc/embedtv/${tmdbId}`,
        `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=1`,
        `https://player.smashy.stream/tv/${tmdbId}`,
        `https://vidsrc.pro/embed/tv/${tmdbId}`,
      ];
    }
    
    return [
      `https://vidsrc.xyz/embed/movie/${tmdbId}`,
      `https://vidsrc.to/embed/movie/${tmdbId}`,
      `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
      `https://www.2embed.cc/embed/${tmdbId}`,
      `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
      `https://player.smashy.stream/movie/${tmdbId}`,
      `https://vidsrc.pro/embed/movie/${tmdbId}`,
    ];
  },

  // Parsear filme/série/anime
  async parseMovie(data: any, type: 'movie' | 'series' | 'anime' = 'movie'): Promise<VercelMovie> {
    if (!data) return this.getDefaultMovie();

    const id = data.link || `${type}-${Date.now()}-${Math.random()}`;
    const imdbRating = data.imdb ? parseFloat(data.imdb.replace('IMDb', '').trim()) : 7.0;
    const title = data.titulo || 'Sem título';
    const year = data.ano || '2024';

    const tmdbType = type === 'series' || type === 'anime' ? 'tv' : 'movie';
    const tmdbId = await this.getTMDBId(title, year, tmdbType);
    
    const alternativeLinks = tmdbId ? this.generateEmbedLinks(tmdbId, tmdbType) : [];
    const primaryLink = alternativeLinks.length > 0 ? alternativeLinks[0] : null;

    const parsed: VercelMovie = {
      id,
      title,
      year,
      genre: ['Ação'],
      rating: imdbRating,
      duration: data.duracao || '0 Min',
      image: data.capa || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
      backdrop: data.capa,
      description: `${title} (${year})`,
      director: 'N/A',
      cast: [],
      link: primaryLink,
      alternativeLinks: alternativeLinks,
      tmdbId: tmdbId || undefined,
      quality: 'HD',
      language: 'DUB',
      type,
    };

    return parsed;
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
      type: 'movie',
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
      alternativeLinks: vercelMovie.alternativeLinks,
      tmdbId: vercelMovie.tmdbId,
      quality: vercelMovie.quality,
      language: vercelMovie.language,
      type: vercelMovie.type,
      seasons: vercelMovie.seasons,
      totalSeasons: vercelMovie.totalSeasons,
      totalEpisodes: vercelMovie.totalEpisodes,
    };
  },
};