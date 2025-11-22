// ARQUIVO: services/custom-api.js (VERSÃO CORRIGIDA)

// Usar proxy local em desenvolvimento, URL direta em produção
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/appv2_2_0_10.php'
  : 'http://appservidor.erremepe.com:80/ajax/appv/appv2_2_0_10.php';

// ... (o resto das suas interfaces e categorias continua igual) ...
export const customCategories = [ /* ... seu array de categorias ... */ ];

export const customApiService = {
  // Buscar filmes por categoria
  async getMoviesByCategory(categorySlug: string, page: number = 1) {
    const url = `${API_BASE_URL}?tipo=categoria&nome=${categorySlug}&pagina=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na API');
    const data = await response.json();
    const movies = this.parseMoviesFromResponse(data);
    // Retornamos um objeto compatível com useInfiniteQuery
    return { results: movies, currentPage: page };
  },

  // Buscar todos os filmes (página inicial)
  async getAllMovies(page: number = 1) {
    // A sua lógica original chama a categoria 'ação' como padrão. Mantendo isso.
    const url = `${API_BASE_URL}?tipo=categoria&nome=categoria-acao&pagina=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na API');
    const data = await response.json();
    const movies = this.parseMoviesFromResponse(data);
    return { results: movies, currentPage: page };
  },

  // Buscar filmes (pesquisa)
  async searchMovies(query: string, page: number = 1) {
    const url = `${API_BASE_URL}?tipo=busca&query=${encodeURIComponent(query)}&pagina=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na API');
    const data = await response.json();
    const movies = this.parseMoviesFromResponse(data);
    return { results: movies, currentPage: page };
  },

  // ... (o resto das suas funções como getMovieById, parseMoviesFromResponse, etc., continuam iguais) ...
  // Cole o resto das suas funções aqui para não perdê-las.
};
