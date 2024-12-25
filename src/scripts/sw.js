const CACHE_NAME = "restaurant-cache-v1";
const BASE_URL = "https://restaurant-api.dicoding.dev";

self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (e) => {
  const { request } = e;

  if (request.url.startsWith(BASE_URL)) {
    e.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);

          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());

          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response("No internet connection and no cache available", {
            status: 503,
            statusText: error || "Service Unavailable",
          });
        }
      })()
    );
  }
});
