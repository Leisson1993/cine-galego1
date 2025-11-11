import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Film, Maximize2, ExternalLink, RefreshCw } from "lucide-react";
import { peelinkService } from "@/services/peelink";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeelinkPlayerProps {
  movieTitle: string;
  movieYear: string;
}

export const PeelinkPlayer = ({ movieTitle, movieYear }: PeelinkPlayerProps) => {
  const [embedUrls, setEmbedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);

  useEffect(() => {
    const loadEmbedUrls = async () => {
      setLoading(true);
      
      // Gerar URLs de embed
      const urls = peelinkService.generateEmbedUrls(movieTitle, movieYear);
      setEmbedUrls(urls);

      // Definir primeira URL como padrão
      if (urls.length > 0) {
        setSelectedUrl(urls[0]);
      }

      setLoading(false);
    };

    loadEmbedUrls();
  }, [movieTitle, movieYear]);

  const languages = peelinkService.getLanguageOptions();

  const handleServerChange = (index: number) => {
    setCurrentServerIndex(index);
    setSelectedUrl(embedUrls[index]);
    if (showPlayer) {
      setShowPlayer(false);
      setTimeout(() => setShowPlayer(true), 100);
    }
  };

  const handleRefresh = () => {
    setShowPlayer(false);
    setTimeout(() => setShowPlayer(true), 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Carregando player...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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

        {/* Player Embutido */}
        {showPlayer && selectedUrl ? (
          <div className="space-y-4">
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                key={selectedUrl}
                src={selectedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                title="Peelink Player"
              />
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
                onClick={() => window.open(selectedUrl, '_blank')}
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
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowPlayer(true)}
          >
            <Play className="w-5 h-5 mr-2" />
            Assistir Agora
          </Button>
        )}

        {/* Servidores Alternativos */}
        {embedUrls.length > 1 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Servidores Alternativos
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {embedUrls.slice(0, 6).map((url, index) => (
                <Button
                  key={index}
                  variant={currentServerIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleServerChange(index)}
                  className="w-full"
                >
                  Servidor {index + 1}
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
            <strong>Dica:</strong> Se o player não carregar, tente outro servidor ou abra a página completa do Peelink.
            Alguns servidores podem ter proteção contra embed.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};