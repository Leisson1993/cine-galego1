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
      
      // Retorna a URL de busca para o usuário abrir
      return searchUrl;
    } catch (error) {
      console.error('Erro ao buscar no Peelink:', error);
      return null;
    }
  },

  // Gerar URL direta do Peelink baseado no título
  generatePeelinkUrl(movieTitle: string, year?: string): string {
    // Normalizar título para URL do Peelink
    const normalizedTitle = movieTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();

    const yearSuffix = year ? `-${year}` : '';
    return `${PEELINK_BASE_URL}/ver-${normalizedTitle}${yearSuffix}-online.html`;
  },

  // Buscar por diferentes variações do título
  generateMultipleUrls(movieTitle: string, year?: string): string[] {
    const urls: string[] = [];
    
    // URL principal
    urls.push(this.generatePeelinkUrl(movieTitle, year));
    
    // Variações comuns
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

    return [...new Set(urls)]; // Remove duplicatas
  },

  // Verificar se o filme existe no Peelink
  async checkMovieExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
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
};