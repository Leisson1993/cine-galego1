import { useQuery } from "@tanstack/react-query";
import { customApiService, customCategories } from "@/services/custom-api";

export const useCustomMovies = () => {
  // Buscar todos os filmes
  const useAllMovies = (page: number = 1) => {
    return useQuery({
      queryKey: ['custom-movies', 'all', page],
      queryFn: () => customApiService.getAllMovies(page),
      select: (data) => ({
        ...data,
        results: data.results.map(movie => customApiService.convertToLocalMovie(movie))
      }),
    });
  };

  // Buscar filmes por categoria
  const useMoviesByCategory = (categorySlug: string, page: number = 1) => {
    return useQuery({
      queryKey: ['custom-movies', 'category', categorySlug, page],
      queryFn: () => customApiService.getMoviesByCategory(categorySlug, page),
      enabled: !!categorySlug && categorySlug !== '',
      select: (data) => ({
        ...data,
        results: data.results.map(movie => customApiService.convertToLocalMovie(movie))
      }),
    });
  };

  // Buscar filmes
  const useSearchMovies = (query: string, page: number = 1) => {
    return useQuery({
      queryKey: ['custom-movies', 'search', query, page],
      queryFn: () => customApiService.searchMovies(query, page),
      enabled: query.length > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => customApiService.convertToLocalMovie(movie))
      }),
    });
  };

  // Buscar detalhes do filme
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['custom-movie', 'details', movieId],
      queryFn: () => customApiService.getMovieById(movieId),
      enabled: !!movieId,
      select: (data) => data ? customApiService.convertToLocalMovie(data) : null,
    });
  };

  return {
    categories: customCategories,
    useAllMovies,
    useMoviesByCategory,
    useSearchMovies,
    useMovieDetails,
  };
};