import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customApiService, customCategories } from "@/services/custom-api";

export const useCustomMovies = () => {
  const queryClient = useQueryClient();

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

  // Buscar detalhes do filme - NOVO: busca no cache primeiro
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['custom-movie', 'details', movieId],
      queryFn: async () => {
        console.log('🔍 Buscando filme ID:', movieId);
        
        // Primeiro, tentar encontrar o filme no cache das listagens
        const allMoviesCache = queryClient.getQueriesData({ queryKey: ['custom-movies'] });
        
        for (const [, data] of allMoviesCache) {
          if (data && typeof data === 'object' && 'results' in data) {
            const cachedData = data as { results: any[] };
            const foundMovie = cachedData.results.find((m: any) => m.id === movieId);
            
            if (foundMovie) {
              console.log('✅ Filme encontrado no cache:', foundMovie);
              return foundMovie;
            }
          }
        }
        
        // Se não encontrou no cache, tentar buscar na API
        console.log('⚠️ Filme não encontrado no cache, buscando na API...');
        const apiResult = await customApiService.getMovieById(movieId);
        
        if (apiResult) {
          return customApiService.convertToLocalMovie(apiResult);
        }
        
        console.error('❌ Filme não encontrado na API');
        return null;
      },
      enabled: !!movieId,
      staleTime: 1000 * 60 * 5, // 5 minutos
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