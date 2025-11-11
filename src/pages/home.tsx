import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { MovieCard } from "@/components/movie-card";
import { movies, categories } from "@/data/movies";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "all" ||
        movie.genre.some(
          (g) => g.toLowerCase() === categories.find(c => c.slug === selectedCategory)?.name.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container px-4 py-8">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Nenhum filme encontrado
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory === "all" ? "Todos os Filmes" : categories.find(c => c.slug === selectedCategory)?.name}
              <span className="text-muted-foreground ml-2">
                ({filteredMovies.length})
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
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