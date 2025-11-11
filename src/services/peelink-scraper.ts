const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export interface PlayerLink {
  url: string;
  server: string;
  language: string;
  quality: string;
}

export const peelinkScraperService = {
  // Extrair links de players usando Edge Function
  async extractPlayerLinksFromPage(movieTitle: string, year?: string): Promise<PlayerLink[]> {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('Supabase não configurado');
        return [];
      }

      const functionUrl = `${SUPABASE_URL}/functions/v1/scrape-peelink`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          movieTitle,
          year,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.players) {
        console.log(`Encontrados ${data.count} players para "${movieTitle}"`);
        return data.players;
      }

      console.error('Nenhum player encontrado:', data);
      return [];
    } catch (error) {
      console.error('Erro ao extrair links do player:', error);
      return [];
    }
  },

  // Buscar link direto do player
  async getDirectPlayerLink(movieTitle: string, year?: string): Promise<string | null> {
    try {
      const playerLinks = await this.extractPlayerLinksFromPage(movieTitle, year);
      
      if (playerLinks.length > 0) {
        return playerLinks[0].url;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar link direto:', error);
      return null;
    }
  },
};