const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export const omdbService = {
  // Buscar filme por título
  async searchByTitle(title: string): Promise<OMDbMovie | null> {
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`
      );
      const data = await response.json();
      
      if (data.Response === "False") {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar filme na OMDb:', error);
      return null;
    }
  },

  // Buscar filme por IMDb ID
  async getByImdbId(imdbId: string): Promise<OMDbMovie | null> {
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`
      );
      const data = await response.json();
      
      if (data.Response === "False") {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar filme na OMDb:', error);
      return null;
    }
  },

  // Buscar múltiplos filmes
  async search(query: string, page: number = 1): Promise<{ Search: any[]; totalResults: string } | null> {
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      
      if (data.Response === "False") {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar filmes na OMDb:', error);
      return null;
    }
  },
};