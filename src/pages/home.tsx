import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { useMovies } from "@/hooks/use-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page] = useState(1);

  const { genres, usePopularMovies, useMoviesByGenre, useSearchMovies } = useMovies();

  // Determinar qual query usar
  const selectedGenreId = useMemo(() => {
    if (selectedCategory === "all") return 0;
    const genre = genres.find(g => g.name.toLowerCase() === selectedCategory.toLowerCase());
    return genre?.id || 0;
  }, [selectedCategory, genres]);

  // Buscar filmes baseado no estado
  const popularQuery = usePopularMovies(page);
  const genreQuery = useMoviesByGenre(selectedGenreId, page);
  const searchQuery_result = useSearchMovies(searchQuery, page);

  // Determinar qual resultado usar
  const { data, isLoading, error } = useMemo(() => {
    if (searchQuery.length > 0) return searchQuery_result;
    if (selectedGenreId > 0) return genreQuery;
    return popularQuery;
  }, [searchQuery, selectedGenreId, searchQuery_result, genreQuery, popularQuery]);

  const movies = data?.results || [];

  // Criar categorias a partir dos gêneros da API
  const categories = useMemo(() => {
    return [
      { id: "all", name: "Todos", slug: "all" },
      ...genres.map(genre => ({
        id: genre.id.toString(),
        name: genre.name,
        slug: genre.name.toLowerCase(),
      }))
    ];
  }, [genres]);

  // Verificar se a API key está configurada
  useEffect(() => {
    if (!import.meta.env.VITE_TMDB_API_KEY) {
      console.error('TMDB API Key não configurada! Configure VITE_TMDB_API_KEY no arquivo .env');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container px-4 py-8">
        {!import.meta.env.VITE_TMDB_API_KEY && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Configure sua chave de API do TMDB no arquivo .env como VITE_TMDB_API_KEY
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar filmes. Verifique sua conexão e tente novamente.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Carregando...</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Nenhum filme encontrado
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery ? `Resultados para "${searchQuery}"` : 
               selectedCategory === "all" ? "Filmes Populares" : 
               categories.find(c => c.slug === selectedCategory)?.name}
              <span className="text-muted-foreground ml-2">
                ({movies.length})
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;