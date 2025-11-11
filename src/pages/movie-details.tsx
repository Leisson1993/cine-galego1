import { useParams, useNavigate } from "react-router-dom";
import { movies } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Clock, Calendar, Play } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Filme não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const handleWatch = () => {
    showSuccess("Iniciando reprodução...");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={movie.image}
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
              src={movie.image}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genre.map((genre, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  {genre}
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
                    {movie.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Diretor</h3>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Elenco</h3>
                  <p className="text-muted-foreground">
                    {movie.cast.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;