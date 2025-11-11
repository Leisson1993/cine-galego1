import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Tv, Film } from "lucide-react";
import type { Season, Episode } from "@/types/movie";

interface SeasonSelectorProps {
  seasons: Season[];
  onEpisodeSelect: (episode: Episode, seasonNumber: number) => void;
  selectedEpisode?: { seasonNumber: number; episodeNumber: number };
}

export const SeasonSelector = ({ seasons, onEpisodeSelect, selectedEpisode }: SeasonSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState(1);

  const currentSeason = seasons.find(s => s.number === selectedSeason) || seasons[0];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-primary" />
          Temporadas e Episódios
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Seletor de Temporadas */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Selecione a Temporada</h4>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {seasons.map((season) => (
                <Button
                  key={season.id}
                  variant={selectedSeason === season.number ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeason(season.number)}
                  className="whitespace-nowrap"
                >
                  Temporada {season.number}
                  <Badge variant="secondary" className="ml-2">
                    {season.episodes.length}
                  </Badge>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Lista de Episódios */}
        {currentSeason && (
          <div>
            <h4 className="font-semibold text-sm mb-3">
              Episódios - Temporada {currentSeason.number}
            </h4>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {currentSeason.episodes.map((episode) => {
                  const isSelected = 
                    selectedEpisode?.seasonNumber === currentSeason.number && 
                    selectedEpisode?.episodeNumber === episode.number;

                  return (
                    <Button
                      key={episode.id}
                      variant={isSelected ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3"
                      onClick={() => onEpisodeSelect(episode, currentSeason.number)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <Play className="w-5 h-5 fill-current" />
                          ) : (
                            <Film className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">
                            Episódio {episode.number}
                          </div>
                          {episode.title && episode.title !== `Episódio ${episode.number}` && (
                            <div className="text-xs text-muted-foreground">
                              {episode.title}
                            </div>
                          )}
                        </div>
                        {episode.duration && (
                          <Badge variant="secondary" className="text-xs">
                            {episode.duration}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Informações */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total de Temporadas: {seasons.length}</span>
            <span>
              Total de Episódios: {seasons.reduce((acc, s) => acc + s.episodes.length, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};