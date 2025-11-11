import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Film, Maximize2, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { peelinkService } from "@/services/peelink";
import { peelinkScraperService, PlayerLink } from "@/services/peelink-scraper";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
    setTimeout(() => setShowPlayer(true), 100);
  };

  const handleServerChange = (link: PlayerLink) => {
    setSelectedLink(link);
    if (showPlayer) {
      setShowPlayer(false);
      setTimeout(() => setShowPlayer(true), 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Assistir Agora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Buscando players disponíveis...</span>
          </div>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Player Embutido */}
        {showPlayer && selectedLink ? (
          <div className="space-y-4">
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                key={selectedLink.url}
                src={selectedLink.url}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                title="Peelink Player"
              />
            </div>
            
            {/* Info do Servidor */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Servidor: <strong>{selectedLink.server}</strong>
              </span>
              <Badge variant="secondary">{selectedLink.quality}</Badge>
            </div>
            
            {/* Botões de Controle */}
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
                onClick={() => window.open(selectedLink.url, '_blank')}
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
          </div>
        ) : playerLinks.length > 0 && !showPlayer ? (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowPlayer(true)}
          >
            <Play className="w-5 h-5 mr-2" />
            Assistir Agora
          </Button>
        ) : null}

        {/* Servidores Alternativos */}
        {playerLinks.length > 1 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
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
            <strong>Como funciona:</strong> Clique em "Carregar Players" para buscar os links diretos dos servidores de streaming disponíveis no Peelink.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};