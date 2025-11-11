import { useQuery, useQueryClient } from "@tanstack/react-query";
import { flixyApiService, flixyCategories } from "@/services/flixy-api";

export const useFlixyMovies = () => {
  const queryClient = useQueryClient();

  // Buscar todos os filmes
  const useAllMovies = () => {
    return useQuery({
      queryKey: ['flixy-movies', 'all'],
      queryFn: () => flixyApiService.getAllMovies(),
      select: (data) => ({
        ...data,
        results: data.results.map(movie => flixyApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  // Buscar filmes por categoria
  const useMoviesByCategory = (categorySlug: string) => {
    return useQuery({
      queryKey: ['flixy-movies', 'category', categorySlug],
      queryFn: () => flixyApiService.getMoviesByCategory(categorySlug),
      enabled: !!categorySlug,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => flixyApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Buscar filmes
  const useSearchMovies = (query: string) => {
    return useQuery({
      queryKey: ['flixy-movies', 'search', query],
      queryFn: () => flixyApiService.searchMovies(query),
      enabled: query.length > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => flixyApiService.convertToLocalMovie(movie))
      }),
    });
  };

  // Buscar detalhes do filme
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['flixy-movie', 'details', movieId],
      queryFn: async () => {
        console.log('🔍 Buscando filme ID:', movieId);
        
        // Primeiro, tentar encontrar o filme no cache
        const allMoviesCache = queryClient.getQueriesData({ queryKey: ['flixy-movies'] });
        
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
        
        // Se não encontrou no cache, buscar na API
        console.log('⚠️ Filme não encontrado no cache, buscando na API...');
        const apiResult = await flixyApiService.getMovieById(movieId);
        
        if (apiResult) {
          return flixyApiService.convertToLocalMovie(apiResult);
        }
        
        console.error('❌ Filme não encontrado');
        return null;
      },
      enabled: !!movieId,
      staleTime: 1000 * 60 * 5,
    });
  };

  // Buscar URL do vídeo
  const useVideoUrl = (movieId: string) => {
    return useQuery({
      queryKey: ['flixy-video', movieId],
      queryFn: () => flixyApiService.getVideoUrl(movieId),
      enabled: !!movieId,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    categories: flixyCategories,
    useAllMovies,
    useMoviesByCategory,
    useSearchMovies,
    useMovieDetails,
    useVideoUrl,
  };
};