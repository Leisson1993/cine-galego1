import { omdbService } from "./omdb";

export interface StreamingOption {
  platform: string;
  url: string;
  type: 'subscription' | 'rent' | 'buy' | 'free';
  price?: string;
  quality?: string;
}

export const streamingService = {
  // Buscar trailer no YouTube
  getYouTubeTrailerUrl(movieTitle: string, year: string): string {
    const query = encodeURIComponent(`${movieTitle} ${year} trailer oficial`);
    return `https://www.youtube.com/results?search_query=${query}`;
  },

  // Gerar link de busca do YouTube para embed
  getYouTubeEmbedSearch(movieTitle: string, year: string): string {
    const query = encodeURIComponent(`${movieTitle} ${year} trailer`);
    return `https://www.youtube.com/embed?listType=search&list=${query}`;
  },

  // Buscar onde assistir (JustWatch)
  getJustWatchUrl(movieTitle: string): string {
    const slug = movieTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `https://www.justwatch.com/br/filme/${slug}`;
  },

  // Sugerir plataformas de streaming populares
  async getSuggestedPlatforms(movieTitle: string): Promise<StreamingOption[]> {
    const platforms: StreamingOption[] = [
      {
        platform: 'Netflix',
        url: `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`,
        type: 'subscription',
      },
      {
        platform: 'Amazon Prime Video',
        url: `https://www.primevideo.com/search?phrase=${encodeURIComponent(movieTitle)}`,
        type: 'subscription',
      },
      {
        platform: 'Disney+',
        url: `https://www.disneyplus.com/search?q=${encodeURIComponent(movieTitle)}`,
        type: 'subscription',
      },
      {
        platform: 'HBO Max',
        url: `https://www.max.com/search?q=${encodeURIComponent(movieTitle)}`,
        type: 'subscription',
      },
      {
        platform: 'Apple TV',
        url: `https://tv.apple.com/search?term=${encodeURIComponent(movieTitle)}`,
        type: 'rent',
      },
      {
        platform: 'Google Play',
        url: `https://play.google.com/store/search?q=${encodeURIComponent(movieTitle)}&c=movies`,
        type: 'rent',
      },
    ];

    return platforms;
  },

  // Buscar filmes gratuitos no Archive.org
  getArchiveOrgUrl(movieTitle: string): string {
    const query = encodeURIComponent(movieTitle);
    return `https://archive.org/search.php?query=${query}&and[]=mediatype%3A%22movies%22`;
  },

  // Verificar se o filme tem website oficial
  async getOfficialWebsite(movieTitle: string): Promise<string | null> {
    const omdbData = await omdbService.searchByTitle(movieTitle);
    return omdbData?.Website && omdbData.Website !== "N/A" ? omdbData.Website : null;
  },
};