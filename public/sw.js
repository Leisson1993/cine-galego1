const CACHE_NAME = 'cine-galego-v1';
const RUNTIME_CACHE = 'cine-galego-runtime';

// Arquivos essenciais para cache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/logo.jpg',
  '/manifest.json',
];

// Instalar Service Worker e fazer cache inicial
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache inicial criado');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker ativado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições de APIs externas e chrome-extension
  if (
    url.origin !== location.origin ||
    url.protocol === 'chrome-extension:' ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Estratégia: Network First, depois Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Se a resposta for válida, salvar no cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Se falhar, tentar buscar do cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('📦 Servindo do cache:', request.url);
            return cachedResponse;
          }
          
          // Se não tiver no cache e for uma página HTML, retornar página offline
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
          
          // Retornar resposta vazia para outros tipos
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Limpar cache periodicamente (manter apenas últimos 50 itens)
self.addEventListener('message', (event) => {
  if (event.data === 'CLEAR_CACHE') {
    caches.open(RUNTIME_CACHE).then((cache) => {
      cache.keys().then((keys) => {
        if (keys.length > 50) {
          keys.slice(0, keys.length - 50).forEach((key) => {
            cache.delete(key);
          });
        }
      });
    });
  }
});