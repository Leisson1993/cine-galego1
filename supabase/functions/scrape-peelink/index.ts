import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlayerLink {
  url: string;
  server: string;
  language: string;
  quality: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { movieTitle, year } = await req.json();

    if (!movieTitle) {
      return new Response(
        JSON.stringify({ error: 'movieTitle é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar URL da página do filme
    const normalizedTitle = movieTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const yearSuffix = year ? `-${year}` : '';
    const pageUrl = `https://www.peelink2.com/ver-${normalizedTitle}${yearSuffix}-online.html`;

    console.log('Buscando página:', pageUrl);

    // Fazer requisição para a página
    const response = await fetch(pageUrl);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.status}`);
    }

    const html = await response.text();

    // Extrair links de players
    const playerLinks: PlayerLink[] = [];

    // Regex para encontrar iframes
    const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
    let match;

    while ((match = iframeRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }

    // Regex para data-player
    const dataPlayerRegex = /data-player=["']([^"']+)["']/gi;
    
    while ((match = dataPlayerRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }

    // Regex para data-src
    const dataSrcRegex = /data-src=["']([^"']+)["']/gi;
    
    while ((match = dataSrcRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }

    // Regex para links em onclick
    const onclickRegex = /onclick=["']window\.open\(["']([^"']+)["']/gi;
    
    while ((match = onclickRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (isValidPlayerUrl(url)) {
        playerLinks.push({
          url: url,
          server: detectServer(url),
          language: 'Latino',
          quality: 'HD',
        });
      }
    }

    // Remover duplicatas
    const uniqueLinks = Array.from(
      new Map(playerLinks.map(link => [link.url, link])).values()
    );

    console.log(`Encontrados ${uniqueLinks.length} players`);

    return new Response(
      JSON.stringify({ 
        success: true,
        pageUrl,
        players: uniqueLinks,
        count: uniqueLinks.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro no scraping:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function isValidPlayerUrl(url: string): boolean {
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
    'embedsito',
    'player',
  ];
  
  return validDomains.some(domain => url.toLowerCase().includes(domain));
}

function detectServer(url: string): string {
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
  if (urlLower.includes('embedsito')) return 'Embedsito';
  if (urlLower.includes('peelink')) return 'Peelink';
  
  return 'Player';
}