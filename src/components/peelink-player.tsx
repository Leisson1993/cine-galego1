import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Film, Maximize2, ExternalLink } from "lucide-react";
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
  const [peelinkUrls, setPeelinkUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const loadPeelinkUrls = async () => {
      setLoading(true);
      
      // Gerar URLs possíveis
      const urls = peelinkService.generateMultipleUrls(movieTitle, movieYear);
      setPeelinkUrls(urls);

      // Definir primeira URL como padrão
      if (urls.length > 0) {
        setSelectedUrl(urls[0]);
      }

      setLoading(false);
    };

    loadPeelinkUrls();
  }, [movieTitle, movieYear]);

  const languages = peelinkService.getLanguageOptions();

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
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={selectedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-primary"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Peelink Player"
              />
            </div>
            
            {/* Botões de Controle */}
            <div className="flex gap-2">
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
                Fechar Player
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
        {peelinkUrls.length > 1 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Servidores Alternativos
            </h4>
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(peelinkUrls.length, 3)}, 1fr)` }}>
                {peelinkUrls.slice(0, 3).map((url, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    onClick={() => {
                      setSelectedUrl(url);
                      if (showPlayer) {
                        setShowPlayer(false);
                        setTimeout(() => setShowPlayer(true), 100);
                      }
                    }}
                  >
                    Servidor {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Link Direto */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => window.open(selectedUrl || peelinkUrls[0], '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir no Peelink (Nova Aba)
          </Button>
        </div>

        {/* Informações */}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Player integrado do Peelink
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Disponível em múltiplos servidores e idiomas
          </p>
        </div>
      </CardContent>
    </Card>
  );
};