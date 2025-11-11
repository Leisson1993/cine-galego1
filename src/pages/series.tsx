import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { useVercelMovies } from "@/hooks/use-vercel-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { categories, useAllSeries, useSearchMovies } = useVercelMovies();

  const seriesQuery = useAllSeries();
  const searchQueryResult = useSearchMovies(searchQuery);

  const { data, isLoading, error, refetch } = useMemo(() => {
    if (searchQuery.length > 0) return searchQueryResult;
    return seriesQuery;
  }, [searchQuery, searchQueryResult, seriesQuery]);

  const allSeries = data?.results || [];
  
  // Filtrar por categoria se necessário
  const series = useMemo(() => {
    if (selectedCategory === "all") return allSeries;
    
    return allSeries.filter(serie => {
      if (!serie.genre || !Array.isArray(serie.genre)) return false;
      
      const genreLower = serie.genre.map(g => g.toLowerCase());
      
      const categoryMap: { [key: string]: string[] } = {
        'action': ['ação', 'action'],
        'animation': ['animação', 'animation'],
        'drama': ['drama'],
        'romance': ['romance'],
        'comedy': ['comédia', 'comedy'],
        'scifi': ['ficção científica', 'sci-fi', 'science fiction'],
        'horror': ['terror', 'horror'],
        'adventure': ['aventura', 'adventure'],
        'fantasy': ['fantasia', 'fantasy'],
        'thriller': ['thriller', 'suspense'],
      };
      
      const searchTerms = categoryMap[selectedCategory.toLowerCase()] || [selectedCategory];
      
      return genreLower.some(g => 
        searchTerms.some(term => g.includes(term.toLowerCase()))
      );
    });
  }, [allSeries, selectedCategory]);

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
                  <strong>Erro ao carregar séries</strong>
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
            <div className="flex items-center gap-2 mb-6">
              <Tv className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Carregando séries...</h2>
            </div>
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
        ) : series.length === 0 ? (
          <div className="text-center py-20">
            <Tv className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">
              Nenhuma série encontrada
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Tente buscar por outro termo
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Tv className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Resultados para "${searchQuery}"` : 
                 selectedCategory === "all" ? "Séries em Destaque" : 
                 categories.find(c => c.slug === selectedCategory)?.name}
                <span className="text-muted-foreground ml-2">
                  ({series.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {series.map((serie: any) => (
                <MovieCard key={serie.id} movie={serie} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Series;