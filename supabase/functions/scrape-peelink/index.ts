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
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.status}`);
    }

    const html = await response.text();

    // Extrair links de players
    const playerLinks: PlayerLink[] = [];
    const foundUrls = new Set<string>();

    // Regex melhorado para encontrar URLs de players
    const patterns = [
      // iframes
      /<iframe[^>]+src=["']([^"']+)["']/gi,
      // data-player
      /data-player=["']([^"']+)["']/gi,
      // data-src
      /data-src=["']([^"']+)["']/gi,
      // onclick com window.open
      /onclick=["']window\.open\(["']([^"']+)["']/gi,
      // URLs diretas de players conhecidos
      /https?:\/\/[^"'\s<>]+(?:streamtape|doodstream|mixdrop|upstream|fembed|streamlare|voe|streamwish|filemoon|vidoza|embedsito)[^"'\s<>]*/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const url = match[1] || match[0];
        
        if (isValidPlayerUrl(url) && !foundUrls.has(url)) {
          foundUrls.add(url);
          playerLinks.push({
            url: url,
            server: detectServer(url),
            language: 'Latino',
            quality: 'HD',
          });
        }
      }
    }

    console.log(`Encontrados ${playerLinks.length} players`);

    return new Response(
      JSON.stringify({ 
        success: true,
        pageUrl,
        players: playerLinks,
        count: playerLinks.length
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
  if (!url || typeof url !== 'string') return false;
  
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
  
  const urlLower = url.toLowerCase();
  return validDomains.some(domain => urlLower.includes(domain)) && 
         (url.startsWith('http://') || url.startsWith('https://'));
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