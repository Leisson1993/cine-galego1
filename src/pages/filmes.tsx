// ARQUIVO: Filmes.js (VERSÃO CORRIGIDA)

import { useState } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { useCustomMovies } from "@/hooks/use-custom-movies"; // Verifique o nome do seu hook
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const Filmes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { categories, useAllMovies, useMoviesByCategory, useSearchMovies } = useCustomMovies();

  // A lógica para escolher qual query usar continua a mesma
  const queryResult = searchQuery.length > 0 
    ? useSearchMovies(searchQuery) 
    : selectedCategory !== "all" 
    ? useMoviesByCategory(selectedCategory) 
    : useAllMovies();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = queryResult;

  // Achata os resultados de todas as páginas em um único array
  const movies = data?.pages.flatMap(page => page.results) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container px-4 py-8">
        {/* ... (seu código de erro e loading) ... */}

        {isLoading ? (
          // ...
        ) : movies.length === 0 ? (
          // ...
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {/* ... (seu código de título) ... */}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* BOTÃO DE PAGINAÇÃO */}
            <div className="w-full text-center mt-10">
              {hasNextPage && (
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="secondary"
                >
                  {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais'}
                </Button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Filmes;
