const CACHE_NAME = 'financas-dashboard-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação: Salva os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto: Armazenando assets estáveis');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos de versões anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First (Tenta rede, se falhar, usa cache)
// Isso é ideal para o seu caso porque os dados da planilha mudam sempre.
self.addEventListener('fetch', event => {
  // Ignora requisições para a API do Google Script no cache do Service Worker
  // (O cache dos dados da planilha já é feito via localStorage no index.html)
  if (event.request.url.includes('script.google.com')) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
