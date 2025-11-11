import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { useCustomMovies } from "@/hooks/use-custom-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page] = useState(1);

  const { categories, useAllMovies, useMoviesByCategory, useSearchMovies } = useCustomMovies();

  // Determinar qual API slug usar
  const selectedCategorySlug = useMemo(() => {
    if (selectedCategory === "all") return "";
    const category = categories.find(c => c.slug === selectedCategory);
    return category?.apiSlug || "";
  }, [selectedCategory, categories]);

  // Buscar filmes baseado no estado
  const allMoviesQuery = useAllMovies(page);
  const categoryQuery = useMoviesByCategory(selectedCategorySlug, page);
  const searchQueryResult = useSearchMovies(searchQuery, page);

  // Determinar qual resultado usar
  const { data, isLoading, error, refetch } = useMemo(() => {
    if (searchQuery.length > 0) return searchQueryResult;
    if (selectedCategorySlug) return categoryQuery;
    return allMoviesQuery;
  }, [searchQuery, selectedCategorySlug, searchQueryResult, categoryQuery, allMoviesQuery]);

  const movies = data?.results || [];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Erro ao carregar filmes</strong>
                  <br />
                  <span className="text-sm">
                    {error.message || 'Verifique sua conexão com a internet'}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
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
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">
              Nenhum filme encontrado
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Tente buscar por outro termo
              </p>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery ? `Resultados para "${searchQuery}"` : 
               selectedCategory === "all" ? "Filmes em Destaque" : 
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