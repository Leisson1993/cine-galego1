import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { useVercelMovies } from "@/hooks/use-vercel-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Animes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { categories, useAllAnimes, useSearchMovies } = useVercelMovies();

  const animesQuery = useAllAnimes();
  const searchQueryResult = useSearchMovies(searchQuery);

  const { data, isLoading, error, refetch } = useMemo(() => {
    if (searchQuery.length > 0) return searchQueryResult;
    return animesQuery;
  }, [searchQuery, searchQueryResult, animesQuery]);

  const allAnimes = data?.results || [];
  
  // Filtrar por categoria se necessário
  const animes = useMemo(() => {
    if (selectedCategory === "all") return allAnimes;
    
    return allAnimes.filter(anime => {
      if (!anime.genre || !Array.isArray(anime.genre)) return false;
      
      const genreLower = anime.genre.map(g => g.toLowerCase());
      
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
  }, [allAnimes, selectedCategory]);

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
                  <strong>Erro ao carregar animes</strong>
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
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Carregando animes...</h2>
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
        ) : animes.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">
              Nenhum anime encontrado
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
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Resultados para "${searchQuery}"` : 
                 selectedCategory === "all" ? "Animes em Destaque" : 
                 categories.find(c => c.slug === selectedCategory)?.name}
                <span className="text-muted-foreground ml-2">
                  ({animes.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {animes.map((anime: any) => (
                <MovieCard key={anime.id} movie={anime} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Animes;