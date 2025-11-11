import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, Film } from "lucide-react";
import { peelinkService } from "@/services/peelink";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface PeelinkPlayerProps {
  movieTitle: string;
  movieYear: string;
}

export const PeelinkPlayer = ({ movieTitle, movieYear }: PeelinkPlayerProps) => {
  const [peelinkUrls, setPeelinkUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableUrl, setAvailableUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPeelinkUrls = async () => {
      setLoading(true);
      
      // Gerar URLs possíveis
      const urls = peelinkService.generateMultipleUrls(movieTitle, movieYear);
      setPeelinkUrls(urls);

      // Verificar qual URL está disponível
      for (const url of urls) {
        const exists = await peelinkService.checkMovieExists(url);
        if (exists) {
          setAvailableUrl(url);
          break;
        }
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
            Carregando opções de streaming...
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
          Assistir no Peelink
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

        {/* Link Principal */}
        {availableUrl ? (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-green-800 dark:text-green-200">
                ✓ Filme disponível no Peelink
              </span>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertDescription>
              Verificando disponibilidade...
            </AlertDescription>
          </Alert>
        )}

        {/* Botão Principal */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => window.open(availableUrl || peelinkUrls[0], '_blank')}
        >
          <Play className="w-5 h-5 mr-2" />
          Assistir Agora no Peelink
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        {/* URLs Alternativas */}
        {peelinkUrls.length > 1 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Links Alternativos
            </h4>
            <div className="space-y-2">
              {peelinkUrls.slice(1, 3).map((url, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => window.open(url, '_blank')}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Opção {index + 2}
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Você será redirecionado para o Peelink para assistir ao filme
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Disponível em múltiplos servidores e idiomas
          </p>
        </div>
      </CardContent>
    </Card>
  );
};