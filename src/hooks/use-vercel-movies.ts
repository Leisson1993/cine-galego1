import { useQuery, useQueryClient } from "@tanstack/react-query";
import { vercelApiService, vercelCategories } from "@/services/vercel-api";

export const useVercelMovies = () => {
  const queryClient = useQueryClient();

  // Buscar todos os filmes
  const useAllMovies = () => {
    return useQuery({
      queryKey: ['vercel-movies', 'all'],
      queryFn: () => vercelApiService.getAllMovies(),
      select: (data) => ({
        ...data,
        results: data.results.map(movie => vercelApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  // Buscar todas as séries
  const useAllSeries = () => {
    return useQuery({
      queryKey: ['vercel-series', 'all'],
      queryFn: () => vercelApiService.getAllSeries(),
      select: (data) => ({
        ...data,
        results: data.results.map(movie => vercelApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Buscar todos os animes
  const useAllAnimes = () => {
    return useQuery({
      queryKey: ['vercel-animes', 'all'],
      queryFn: () => vercelApiService.getAllAnimes(),
      select: (data) => ({
        ...data,
        results: data.results.map(movie => vercelApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Buscar filmes por categoria
  const useMoviesByCategory = (categorySlug: string) => {
    return useQuery({
      queryKey: ['vercel-movies', 'category', categorySlug],
      queryFn: () => vercelApiService.getMoviesByCategory(categorySlug),
      enabled: !!categorySlug,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => vercelApiService.convertToLocalMovie(movie))
      }),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Buscar filmes
  const useSearchMovies = (query: string) => {
    return useQuery({
      queryKey: ['vercel-movies', 'search', query],
      queryFn: () => vercelApiService.searchMovies(query),
      enabled: query.length > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => vercelApiService.convertToLocalMovie(movie))
      }),
    });
  };

  // Buscar detalhes do filme/série/anime
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['vercel-movie', 'details', movieId],
      queryFn: async () => {
        console.log('🔍 Buscando conteúdo ID:', movieId);
        
        // Primeiro, tentar encontrar no cache
        const allMoviesCache = queryClient.getQueriesData({ queryKey: ['vercel-movies'] });
        const allSeriesCache = queryClient.getQueriesData({ queryKey: ['vercel-series'] });
        const allAnimesCache = queryClient.getQueriesData({ queryKey: ['vercel-animes'] });
        
        const allCaches = [...allMoviesCache, ...allSeriesCache, ...allAnimesCache];
        
        for (const [, data] of allCaches) {
          if (data && typeof data === 'object' && 'results' in data) {
            const cachedData = data as { results: any[] };
            const foundMovie = cachedData.results.find((m: any) => m.id === movieId);
            
            if (foundMovie) {
              console.log('✅ Conteúdo encontrado no cache:', foundMovie);
              
              // Se for série ou anime, buscar temporadas
              if (foundMovie.type === 'series' || foundMovie.type === 'anime') {
                console.log('📺 Buscando temporadas para:', foundMovie.title);
                const seasons = await vercelApiService.getSeasons(
                  foundMovie.tmdbId || movieId, 
                  foundMovie.type
                );
                
                foundMovie.seasons = seasons;
                foundMovie.totalSeasons = seasons.length;
                foundMovie.totalEpisodes = seasons.reduce((acc: number, s: any) => acc + s.episodes.length, 0);
                
                console.log(`✅ ${seasons.length} temporadas carregadas`);
              }
              
              return foundMovie;
            }
          }
        }
        
        // Se não encontrou no cache, buscar na API
        console.log('⚠️ Conteúdo não encontrado no cache, buscando na API...');
        const apiResult = await vercelApiService.getMovieById(movieId);
        
        if (apiResult) {
          return vercelApiService.convertToLocalMovie(apiResult);
        }
        
        console.error('❌ Conteúdo não encontrado');
        return null;
      },
      enabled: !!movieId,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    categories: vercelCategories,
    useAllMovies,
    useAllSeries,
    useAllAnimes,
    useMoviesByCategory,
    useSearchMovies,
    useMovieDetails,
  };
};