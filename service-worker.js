const CACHE_NAME = "dashboard-financeiro-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// INSTALAÇÃO: salvar arquivos em cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache aberto e arquivos adicionados!");
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ATIVAÇÃO: limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if(key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH: retornar do cache se offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se existir
        if(response) return response;
        // Senão busca online
        return fetch(event.request)
          .catch(() => {
            // Se falhar, podemos retornar uma página offline
            return caches.match("./index.html");
          });
      })
  );
});
