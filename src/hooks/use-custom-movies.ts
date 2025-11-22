// ARQUIVO: hooks/useCustomMovies.js (VERSÃO CORRIGIDA)

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { customApiService, customCategories } from "@/services/custom-api";

export const useCustomMovies = () => {

  // --- 1. Buscar todos os filmes (COM PAGINAÇÃO INFINITA) ---
  const useAllMovies = () => {
    return useInfiniteQuery({
      queryKey: ['custom-movies', 'all'],
      queryFn: ({ pageParam = 1 }) => customApiService.getAllMovies(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // Se a última página retornou resultados, tentamos buscar a próxima.
        // Se retornou uma lista vazia, paramos (retorna undefined).
        return lastPage.results.length > 0 ? lastPage.currentPage + 1 : undefined;
      },
    });
  };

  // --- 2. Buscar filmes por categoria (COM PAGINAÇÃO INFINITA) ---
  const useMoviesByCategory = (categorySlug: string) => {
    return useInfiniteQuery({
      queryKey: ['custom-movies', 'category', categorySlug],
      queryFn: ({ pageParam = 1 }) => customApiService.getMoviesByCategory(categorySlug, pageParam),
      initialPageParam: 1,
      enabled: !!categorySlug && categorySlug !== 'all',
      getNextPageParam: (lastPage) => {
        return lastPage.results.length > 0 ? lastPage.currentPage + 1 : undefined;
      },
    });
  };

  // --- 3. Buscar filmes (COM PAGINAÇÃO INFINITA) ---
  const useSearchMovies = (query: string) => {
    return useInfiniteQuery({
      queryKey: ['custom-movies', 'search', query],
      queryFn: ({ pageParam = 1 }) => customApiService.searchMovies(query, pageParam),
      initialPageParam: 1,
      enabled: query.length > 0,
      getNextPageParam: (lastPage) => {
        return lastPage.results.length > 0 ? lastPage.currentPage + 1 : undefined;
      },
    });
  };

  // A função de detalhes pode continuar a mesma
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['custom-movie', 'details', movieId],
      queryFn: () => customApiService.getMovieById(movieId),
      enabled: !!movieId,
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
