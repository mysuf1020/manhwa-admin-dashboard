/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

const CACHE_NAME = 'mangareader-v1';
const PRECACHE_URLS = ['/', '/manifest.json'];

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
	);
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
		)
	);
	sw.clients.claim();
});

sw.addEventListener('fetch', (event) => {
	// Only cache GET requests and skip API/form submissions
	if (event.request.method !== 'GET') return;
	const url = new URL(event.request.url);
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/')) return;

	// Network-first strategy for HTML pages
	if (event.request.headers.get('accept')?.includes('text/html')) {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
					return response;
				})
				.catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
		);
		return;
	}

	// Cache-first strategy for static assets (images, CSS, JS)
	event.respondWith(
		caches.match(event.request).then((cached) => {
			if (cached) return cached;
			return fetch(event.request).then((response) => {
				if (response.ok && url.origin === sw.location.origin) {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
				}
				return response;
			});
		})
	);
});
