self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Network-first strategy (no aggressive caching)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response("Offline. Please reconnect.", {
                headers: { "Content-Type": "text/plain" }
            });
        })
    );
});
