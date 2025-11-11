import { useQuery } from "@tanstack/react-query";
import { tmdbService, TMDBGenre } from "@/services/tmdb";
import { useState, useEffect } from "react";

export const useMovies = () => {
  const [genres, setGenres] = useState<TMDBGenre[]>([]);

  // Buscar gêneros
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => tmdbService.getGenres(),
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  useEffect(() => {
    if (genresData?.genres) {
      setGenres(genresData.genres);
    }
  }, [genresData]);

  // Buscar filmes populares
  const usePopularMovies = (page: number = 1) => {
    return useQuery({
      queryKey: ['movies', 'popular', page],
      queryFn: () => tmdbService.getPopularMovies(page),
      enabled: genres.length > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => tmdbService.convertToLocalMovie(movie, genres))
      }),
    });
  };

  // Buscar filmes por gênero
  const useMoviesByGenre = (genreId: number, page: number = 1) => {
    return useQuery({
      queryKey: ['movies', 'genre', genreId, page],
      queryFn: () => tmdbService.getMoviesByGenre(genreId, page),
      enabled: genres.length > 0 && genreId > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => tmdbService.convertToLocalMovie(movie, genres))
      }),
    });
  };

  // Buscar filmes
  const useSearchMovies = (query: string, page: number = 1) => {
    return useQuery({
      queryKey: ['movies', 'search', query, page],
      queryFn: () => tmdbService.searchMovies(query, page),
      enabled: genres.length > 0 && query.length > 0,
      select: (data) => ({
        ...data,
        results: data.results.map(movie => tmdbService.convertToLocalMovie(movie, genres))
      }),
    });
  };

  // Buscar detalhes do filme
  const useMovieDetails = (movieId: string) => {
    return useQuery({
      queryKey: ['movie', 'details', movieId],
      queryFn: () => tmdbService.getMovieDetails(Number(movieId)),
      enabled: !!movieId,
    });
  };

  return {
    genres,
    usePopularMovies,
    useMoviesByGenre,
    useSearchMovies,
    useMovieDetails,
  };
};