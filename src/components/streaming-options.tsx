import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, Youtube } from "lucide-react";
import { streamingService, StreamingOption } from "@/services/streaming";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamingOptionsProps {
  movieTitle: string;
  movieYear: string;
}

export const StreamingOptions = ({ movieTitle, movieYear }: StreamingOptionsProps) => {
  const [platforms, setPlatforms] = useState<StreamingOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlatforms = async () => {
      setLoading(true);
      const options = await streamingService.getSuggestedPlatforms(movieTitle);
      setPlatforms(options);
      setLoading(false);
    };

    loadPlatforms();
  }, [movieTitle]);

  const trailerUrl = streamingService.getYouTubeTrailerUrl(movieTitle, movieYear);
  const justWatchUrl = streamingService.getJustWatchUrl(movieTitle);
  const archiveUrl = streamingService.getArchiveOrgUrl(movieTitle);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Onde Assistir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Onde Assistir
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trailer no YouTube */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Trailer</h4>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(trailerUrl, '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2 text-red-600" />
            Assistir Trailer no YouTube
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
        </div>

        {/* Plataformas de Streaming */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
            Plataformas de Streaming
          </h4>
          <div className="space-y-2">
            {platforms.slice(0, 6).map((platform) => (
              <Button
                key={platform.platform}
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(platform.url, '_blank')}
              >
                <Play className="w-4 h-4 mr-2" />
                {platform.platform}
                <span className="ml-auto text-xs text-muted-foreground">
                  {platform.type === 'subscription' ? 'Assinatura' : 
                   platform.type === 'rent' ? 'Aluguel' : 'Compra'}
                </span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>

        {/* JustWatch - Ver todas as opções */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
            Ver Todas as Opções
          </h4>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(justWatchUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver no JustWatch
            <span className="ml-auto text-xs text-muted-foreground">
              Compara preços
            </span>
          </Button>
        </div>

        {/* Archive.org - Filmes gratuitos */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
            Filmes Gratuitos
          </h4>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(archiveUrl, '_blank')}
          >
            <Play className="w-4 h-4 mr-2" />
            Buscar no Archive.org
            <span className="ml-auto text-xs text-muted-foreground">
              Domínio público
            </span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Os links direcionam para plataformas legais de streaming
        </p>
      </CardContent>
    </Card>
  );
};