import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "@/hooks/use-movies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Clock, Calendar, Play } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { tmdbService } from "@/services/tmdb";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useMovieDetails } = useMovies();
  
  const { data: movie, isLoading, error } = useMovieDetails(id || "");

  const handleWatch = () => {
    showSuccess("Iniciando reprodução...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[60vh] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container px-4 -mt-40 relative z-10">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Filme não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const director = movie.credits?.crew.find(person => person.job === "Director");
  const cast = movie.credits?.cast.slice(0, 5) || [];
  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w500');

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <Button
          variant="ghost"
          className="absolute top-4 left-4 z-10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="container px-4 -mt-40 relative z-10">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          <Card className="overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">"{movie.tagline}"</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{Math.round(movie.vote_average * 10) / 10}</span>
                  <span className="text-sm">({movie.vote_count} votos)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <Button size="lg" className="w-full md:w-auto" onClick={handleWatch}>
              <Play className="w-5 h-5 mr-2" />
              Assistir Agora
            </Button>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sinopse</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview || 'Sem descrição disponível'}
                  </p>
                </div>

                {director && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Diretor</h3>
                    <p className="text-muted-foreground">{director.name}</p>
                  </div>
                )}

                {cast.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Elenco Principal</h3>
                    <p className="text-muted-foreground">
                      {cast.map(actor => actor.name).join(", ")}
                    </p>
                  </div>
                )}

                {movie.budget > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Orçamento</h3>
                    <p className="text-muted-foreground">
                      ${movie.budget.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Bilheteria</h3>
                    <p className="text-muted-foreground">
                      ${movie.revenue.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;