const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; department: string }[];
  };
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export const tmdbService = {
  // Buscar filmes populares
  async getPopularMovies(page: number = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    if (!response.ok) throw new Error('Erro ao buscar filmes populares');
    return response.json();
  },

  // Buscar filmes em cartaz
  async getNowPlayingMovies(page: number = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    if (!response.ok) throw new Error('Erro ao buscar filmes em cartaz');
    return response.json();
  },

  // Buscar filmes por categoria/gênero
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${genreId}&page=${page}`
    );
    if (!response.ok) throw new Error('Erro ao buscar filmes por gênero');
    return response.json();
  },

  // Buscar filmes
  async searchMovies(query: string, page: number = 1): Promise<{ results: TMDBMovie[]; total_pages: number }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Erro ao buscar filmes');
    return response.json();
  },

  // Buscar detalhes de um filme
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits,videos`
    );
    if (!response.ok) throw new Error('Erro ao buscar detalhes do filme');
    return response.json();
  },

  // Buscar gêneros
  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    if (!response.ok) throw new Error('Erro ao buscar gêneros');
    return response.json();
  },

  // Gerar URL de imagem
  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
    if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Converter filme TMDB para formato local
  convertToLocalMovie(tmdbMovie: TMDBMovie, genres: TMDBGenre[]): any {
    const movieGenres = tmdbMovie.genre_ids
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean);

    return {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear().toString() : 'N/A',
      genre: movieGenres,
      rating: Math.round(tmdbMovie.vote_average * 10) / 10,
      duration: 'N/A',
      image: this.getImageUrl(tmdbMovie.poster_path),
      backdrop: this.getImageUrl(tmdbMovie.backdrop_path, 'original'),
      description: tmdbMovie.overview || 'Sem descrição disponível',
      director: 'N/A',
      cast: [],
    };
  },
};