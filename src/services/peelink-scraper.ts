const PEELINK_BASE_URL = 'https://www.peelink2.com';

export interface PlayerLink {
  url: string;
  server: string;
  language: string;
  quality: string;
}

export const peelinkScraperService = {
  // Extrair links de players da página HTML
  async extractPlayerLinksFromPage(movieTitle: string, year?: string): Promise<PlayerLink[]> {
    try {
      // Gerar URL da página do filme
      const pageUrl = this.generateMoviePageUrl(movieTitle, year);
      
      // Fazer requisição para a página
      const response = await fetch(pageUrl);
      const html = await response.text();
      
      // Extrair iframes e links de players
      const playerLinks = this.parsePlayerLinks(html);
      
      return playerLinks;
    } catch (error) {
      console.error('Erro ao extrair links do player:', error);
      return [];
    }
  },

  // Gerar URL da página do filme
  generateMoviePageUrl(movieTitle: string, year?: string): string {
    const normalizedTitle = movieTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const yearSuffix = year ? `-${year}` : '';
    return `${PEELINK_BASE_URL}/ver-${normalizedTitle}${yearSuffix}-online.html`;
  },

  // Parsear HTML para extrair links de players
  parsePlayerLinks(html: string): PlayerLink[] {
    const playerLinks: PlayerLink[] = [];
    
    // Regex para encontrar iframes
    const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
    let match;
    
    while ((match = iframeRegex.exec(html)) !== null) {
      const url = match[1];
      
      // Filtrar apenas URLs de players válidos
      if (this.isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: this.detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }
    
    // Regex para encontrar links de players em data attributes
    const dataPlayerRegex = /data-player=["']([^"']+)["']/gi;
    
    while ((match = dataPlayerRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (this.isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: this.detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }
    
    // Regex para encontrar links em botões de players
    const buttonRegex = /onclick=["']window\.open\(["']([^"']+)["']/gi;
    
    while ((match = buttonRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (this.isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: this.detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }
    
    return playerLinks;
  },

  // Verificar se é uma URL de player válida
  isValidPlayerUrl(url: string): boolean {
    const validDomains = [
      'streamtape',
      'doodstream',
      'mixdrop',
      'upstream',
      'fembed',
      'streamlare',
      'voe',
      'streamwish',
      'filemoon',
      'vidoza',
      'peelink',
    ];
    
    return validDomains.some(domain => url.toLowerCase().includes(domain));
  },

  // Detectar servidor do player
  detectServer(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('streamtape')) return 'StreamTape';
    if (urlLower.includes('doodstream')) return 'DoodStream';
    if (urlLower.includes('mixdrop')) return 'MixDrop';
    if (urlLower.includes('upstream')) return 'UpStream';
    if (urlLower.includes('fembed')) return 'Fembed';
    if (urlLower.includes('streamlare')) return 'StreamLare';
    if (urlLower.includes('voe')) return 'VOE';
    if (urlLower.includes('streamwish')) return 'StreamWish';
    if (urlLower.includes('filemoon')) return 'FileMoon';
    if (urlLower.includes('vidoza')) return 'Vidoza';
    if (urlLower.includes('peelink')) return 'Peelink';
    
    return 'Servidor Desconhecido';
  },

  // Buscar link direto do player (método simplificado)
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