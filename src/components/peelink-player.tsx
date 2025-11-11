import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Film, Maximize2, ExternalLink, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { peelinkService } from "@/services/peelink";
import { peelinkScraperService, PlayerLink } from "@/services/peelink-scraper";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PeelinkPlayerProps {
  movieTitle: string;
  movieYear: string;
}

export const PeelinkPlayer = ({ movieTitle, movieYear }: PeelinkPlayerProps) => {
  const [playerLinks, setPlayerLinks] = useState<PlayerLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLink, setSelectedLink] = useState<PlayerLink | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  const loadPlayerLinks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Extrair links de players da página do Peelink
      const links = await peelinkScraperService.extractPlayerLinksFromPage(movieTitle, movieYear);
      
      if (links.length > 0) {
        setPlayerLinks(links);
        setSelectedLink(links[0]);
      } else {
        setError('Nenhum player encontrado. Tente abrir a página completa.');
      }
    } catch (err) {
      console.error('Erro ao carregar players:', err);
      setError('Erro ao carregar players. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const languages = peelinkService.getLanguageOptions();

  const handleRefresh = () => {
    setShowPlayer(false);
    setPlayerReady(false);
    setTimeout(() => setShowPlayer(true), 100);
  };

  const handleServerChange = (link: PlayerLink) => {
    setSelectedLink(link);
    setPlayerReady(false);
    if (showPlayer) {
      setShowPlayer(false);
      setTimeout(() => setShowPlayer(true), 100);
    }
  };

  const handlePlayClick = () => {
    setShowPlayer(true);
    setPlayerReady(true);
  };

  // Detectar quando o iframe carrega
  useEffect(() => {
    if (showPlayer) {
      const timer = setTimeout(() => {
        setPlayerReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPlayer]);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Assistir Agora - Grátis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Idiomas Disponíveis */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
            Idiomas Disponíveis
          </h4>
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <Badge key={lang.code} variant="secondary" className="text-sm">
                {lang.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Botão para Carregar Players */}
        {!loading && playerLinks.length === 0 && !error && (
          <Button
            className="w-full"
            size="lg"
            onClick={loadPlayerLinks}
          >
            <Play className="w-5 h-5 mr-2" />
            Carregar Players
          </Button>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Buscando players disponíveis...</span>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Player Embutido */}
        {showPlayer && selectedLink ? (
          <div className="space-y-4">
            <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              {!playerReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-white">Carregando player...</p>
                    <p className="text-white/60 text-sm mt-2">Clique no play quando aparecer</p>
                  </div>
                </div>
              )}
              <iframe
                key={selectedLink.url}
                src={selectedLink.url}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                title="Peelink Player"
                onLoad={() => setPlayerReady(true)}
              />
            </div>
            
            {/* Info do Servidor */}
            <div className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  Servidor: <strong className="text-foreground">{selectedLink.server}</strong>
                </span>
              </div>
              <Badge variant="secondary">{selectedLink.quality}</Badge>
            </div>
            
            {/* Botões de Controle */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(selectedLink.url, '_blank')}
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Tela Cheia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPlayer(false)}
              >
                Fechar
              </Button>
            </div>

            {/* Dica */}
            <Alert>
              <AlertDescription className="text-xs">
                💡 <strong>Dica:</strong> Se o vídeo não carregar, tente outro servidor abaixo ou clique em "Tela Cheia" para abrir em uma nova aba.
              </AlertDescription>
            </Alert>
          </div>
        ) : playerLinks.length > 0 && !showPlayer ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handlePlayClick}
          >
            <Play className="w-5 h-5 mr-2" />
            Assistir Agora
          </Button>
        ) : null}

        {/* Servidores Alternativos */}
        {playerLinks.length > 1 && (
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
              Servidores Disponíveis ({playerLinks.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {playerLinks.map((link, index) => (
                <Button
                  key={index}
                  variant={selectedLink?.url === link.url ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleServerChange(link)}
                  className="w-full"
                >
                  <Film className="w-4 h-4 mr-2" />
                  {link.server}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Link Direto */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => window.open(peelinkService.generatePeelinkUrl(movieTitle, movieYear), '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Página Completa do Peelink
          </Button>
        </div>

        {/* Informações */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>Como funciona:</strong> Clique em "Carregar Players" para buscar os links diretos dos servidores de streaming disponíveis no Peelink. Todos os filmes são gratuitos!
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};