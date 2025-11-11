const PEELINK_BASE_URL = 'https://www.peelink2.com';

export interface PeelinkStreamingLink {
  quality: string;
  language: string;
  server: string;
  url: string;
}

export interface PeelinkMovie {
  title: string;
  url: string;
  streamingLinks: PeelinkStreamingLink[];
}

export const peelinkService = {
  // Buscar filme no Peelink por título
  async searchMovie(movieTitle: string, year?: string): Promise<string | null> {
    try {
      const searchQuery = year ? `${movieTitle} ${year}` : movieTitle;
      const searchUrl = `${PEELINK_BASE_URL}/?s=${encodeURIComponent(searchQuery)}`;
      
      return searchUrl;
    } catch (error) {
      console.error('Erro ao buscar no Peelink:', error);
      return null;
    }
  },

  // Gerar URL direta do Peelink baseado no título
  generatePeelinkUrl(movieTitle: string, year?: string): string {
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

  // Buscar por diferentes variações do título
  generateMultipleUrls(movieTitle: string, year?: string): string[] {
    const urls: string[] = [];
    
    urls.push(this.generatePeelinkUrl(movieTitle, year));
    
    const variations = [
      movieTitle,
      movieTitle.replace(/:/g, ''),
      movieTitle.replace(/'/g, ''),
      movieTitle.replace(/\s+/g, ' ').trim(),
    ];

    variations.forEach(variation => {
      if (variation !== movieTitle) {
        urls.push(this.generatePeelinkUrl(variation, year));
      }
    });

    return [...new Set(urls)];
  },

  // Extrair links de players da página do Peelink
  async extractPlayerLinks(pageUrl: string): Promise<string[]> {
    try {
      // Como não podemos fazer scraping direto por CORS,
      // vamos usar um proxy ou retornar a URL da página
      // O usuário pode implementar um backend para fazer o scraping
      
      // Por enquanto, retornamos URLs de servidores comuns do Peelink
      const movieId = pageUrl.split('/').pop()?.replace('.html', '') || '';
      
      // URLs típicas de players do Peelink
      const playerUrls = [
        `${PEELINK_BASE_URL}/player/${movieId}`,
        `${PEELINK_BASE_URL}/embed/${movieId}`,
        pageUrl, // URL da página como fallback
      ];
      
      return playerUrls;
    } catch (error) {
      console.error('Erro ao extrair links do player:', error);
      return [pageUrl];
    }
  },

  // Gerar URL do player embutido
  getEmbedUrl(movieTitle: string, year?: string): string {
    const pageUrl = this.generatePeelinkUrl(movieTitle, year);
    // Extrair ID do filme da URL
    const movieSlug = pageUrl.split('/').pop()?.replace('.html', '') || '';
    
    // Tentar diferentes formatos de embed
    return `${PEELINK_BASE_URL}/embed/${movieSlug}`;
  },

  // Obter categorias do Peelink
  getCategoryUrl(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'acao': '/2012/12/pagina-accion.html',
      'ficcao': '/2012/12/pagina-ficcion.html',
      'drama': '/2012/12/pagina-drama.html',
      'comedia': '/2012/12/pagina-comedia.html',
      'infantil': '/2012/12/pagina-infantil.html',
      'terror': '/2012/12/pagina-terror.html',
      'anime': '/genero/anime-100',
    };

    return `${PEELINK_BASE_URL}${categoryMap[category.toLowerCase()] || ''}`;
  },

  // Obter idiomas disponíveis
  getLanguageOptions(): Array<{ code: string; name: string; icon: string }> {
    return [
      { code: 'lat', name: 'Latino', icon: 'icon_lat.jpg' },
      { code: 'sub', name: 'Subtitulado', icon: 'icon_sub.jpg' },
      { code: 'es', name: 'Español', icon: 'icon_spa.jpg' },
    ];
  },

  // Gerar múltiplas URLs de embed
  generateEmbedUrls(movieTitle: string, year?: string): string[] {
    const baseUrls = this.generateMultipleUrls(movieTitle, year);
    const embedUrls: string[] = [];

    baseUrls.forEach(url => {
      const slug = url.split('/').pop()?.replace('.html', '') || '';
      
      // Diferentes formatos de embed que o Peelink pode usar
      embedUrls.push(`${PEELINK_BASE_URL}/embed/${slug}`);
      embedUrls.push(`${PEELINK_BASE_URL}/player/${slug}`);
      embedUrls.push(`${PEELINK_BASE_URL}/watch/${slug}`);
      embedUrls.push(url); // URL original como fallback
    });

    return [...new Set(embedUrls)];
  },
};