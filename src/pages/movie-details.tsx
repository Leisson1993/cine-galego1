import { useParams, useNavigate } from "react-router-dom";
import { useVercelMovies } from "@/hooks/use-vercel-movies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Clock, Calendar, Play, AlertCircle, Maximize2, RefreshCw, Server } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useMovieDetails } = useVercelMovies();
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  
  const { data: movie, isLoading, error } = useMovieDetails(id || "");

  const handleRefresh = () => {
    setPlayerKey(prev => prev + 1);
  };

  const handleServerChange = (index: number) => {
    setCurrentServerIndex(index);
    setPlayerKey(prev => prev + 1);
  };

  const currentLink = movie?.alternativeLinks?.[currentServerIndex] || movie?.link;

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Filme não encontrado</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os detalhes deste filme.
            </AlertDescription>
          </Alert>
          
          <Button onClick={() => navigate("/home")} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop || movie.image;
  const posterUrl = movie.image;

  return (
    <div className="min-h-screen bg-background">
      {/* Header com backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover blur-sm scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <Button
          variant="ghost"
          className="absolute top-4 left-4 z-10"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="container px-4 -mt-40 relative z-10 pb-12">
        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Coluna Esquerda - Poster */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop';
                }}
              />
            </Card>

            {/* Informações Extras */}
            <Card>
              <CardContent className="p-4 space-y-3">
                {movie.quality && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Qualidade</h4>
                    <Badge variant="secondary">{movie.quality}</Badge>
                  </div>
                )}
                {movie.language && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Idioma</h4>
                    <Badge variant="secondary">{movie.language}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Informações e Player */}
          <div className="space-y-6">
            {/* Informações do Filme */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie.rating}</span>
                  </div>
                )}
                {movie.year && movie.year !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.duration && movie.duration !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gêneros */}
            {movie.genre && movie.genre.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Player Embutido ou Botão */}
            {currentLink ? (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  {showPlayer ? (
                    <>
                      <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          key={playerKey}
                          src={currentLink}
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="no-referrer-when-downgrade"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                          title={movie.title}
                        />
                      </div>
                      
                      {/* Seletor de Servidores */}
                      {movie.alternativeLinks && movie.alternativeLinks.length > 1 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Server className="w-4 h-4" />
                            Servidores Disponíveis
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {movie.alternativeLinks.map((_, index) => (
                              <Button
                                key={index}
                                variant={currentServerIndex === index ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleServerChange(index)}
                              >
                                Servidor {index + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          className="flex-1"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Recarregar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(currentLink, '_blank')}
                          className="flex-1"
                        >
                          <Maximize2 className="w-4 h-4 mr-2" />
                          Tela Cheia
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPlayer(false)}
                          className="flex-1"
                        >
                          Fechar
                        </Button>
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs">
                          💡 <strong>Dica:</strong> Se o vídeo não carregar, tente outro servidor ou clique em "Tela Cheia".
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setShowPlayer(true)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Assistir Agora
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Link de streaming não disponível para este filme no momento.
                </AlertDescription>
              </Alert>
            )}

            {/* Sinopse e Detalhes */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sinopse</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.description || 'Sem descrição disponível'}
                  </p>
                </div>

                {movie.director && movie.director !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Diretor</h3>
                    <p className="text-muted-foreground">{movie.director}</p>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Elenco Principal</h3>
                    <p className="text-muted-foreground">
                      {movie.cast.join(", ")}
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