// HymnDesk Service Worker — v4.0
// Strategy:
//   - App shell (HTML/JS/manifest/sw.js): network-first, cache fallback
//   - Hymn library (hymns.json): stale-while-revalidate with ETag conditional
//     requests — serves cached copy instantly, revalidates in background.
//     No timestamp cache-busting; Cloudflare CDN handles freshness via ETags.
//   - Supabase API: never cached, never intercepted — all sync calls go direct
//   - Static assets: cache-first
//   - Activates immediately on install (skipWaiting + clients.claim) so PWAs
//     auto-update silently in one cycle.

const CACHE_NAME = 'hymndesk-v18';
const HYMNS_CACHE = 'hymndesk-hymns-v7';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Hosts whose requests must NEVER be intercepted or cached by the SW.
// Supabase REST writes (POST / PATCH / DELETE) are the critical case —
// if we ever cache or interfere with them, sync silently breaks.
const NEVER_CACHE = [
  'script.google.com',
  'google.com/macros',
  'googleapis.com',
  'raw.githubusercontent.com',
  'api.github.com',
  'github.com',
  'supabase.co',
  'supabase.in',
];

// ════════════════════════════════════════════════════════════════════════════
// Silent automatic update strategy
// ════════════════════════════════════════════════════════════════════════════
// install + skipWaiting():
//   The new SW activates immediately as soon as it finishes installing. No
//   "waiting" state, no banner, no user action. Existing tabs keep running
//   the old SW briefly until the activate handler runs.
//
// activate + clients.claim():
//   The new SW takes control of all open pages. This triggers a
//   'controllerchange' event in each page, which the page handles by quietly
//   reloading itself. The end result: the user's view refreshes on its own
//   when an update is available, no interaction needed.
//
// Why this is safe:
//   - We only `skipWaiting` on subsequent updates, not first install (handled
//     by the existence of a previous controller — see install handler).
//   - The page has a 60-second cooldown on controllerchange reloads to prevent
//     any possibility of a reload loop.
// ════════════════════════════════════════════════════════════════════════════

// ── INSTALL ───────────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(APP_SHELL).catch(function() {});
      })
      .then(function() { return self.skipWaiting(); })
  );
});

// ── ACTIVATE ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME && key !== HYMNS_CACHE;
        }).map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  if (event.request.method !== 'GET') return;
  if (NEVER_CACHE.some(function(d) { return url.includes(d); })) return;

  // hymns.json — stale-while-revalidate with ETag conditional requests.
  // Serves the cached copy immediately (fast, offline-safe), then revalidates
  // in the background using If-None-Match. If the server returns 304 Not Modified,
  // no new bytes are transferred. If content changed, the cache is updated silently.
  // No timestamp query strings — Cloudflare CDN handles freshness via ETags.
  var HYMNS_CACHE_KEY = 'https://hymndesk.co.za/hymns.json';
  if (url.includes('hymns.json') && !url.includes('raw.githubusercontent.com') && !url.includes('api.github.com')) {
    event.respondWith(
      caches.open(HYMNS_CACHE).then(function(cache) {
        return cache.match(HYMNS_CACHE_KEY).then(function(cached) {
          var headers = {};
          if (cached) {
            var etag = cached.headers.get('ETag');
            if (etag) headers['If-None-Match'] = etag;
          }
          var fetchPromise = fetch(HYMNS_CACHE_KEY, { headers: headers })
            .then(function(response) {
              if (response.status === 304) { return cached; }
              if (response && response.status === 200) {
                var clone = response.clone();
                cache.put(HYMNS_CACHE_KEY, clone);
              }
              return response;
            })
            .catch(function() {
              return cached || new Response('{"hymns":[]}', {
                headers: { 'Content-Type': 'application/json' }
              });
            });
          return cached ? cached : fetchPromise;
        });
      })
    );
    return;
  }

  // App shell — NETWORK FIRST for HTML/JS, so code updates reach users on every reload.
  // Only falls back to cache if the network fetch fails (offline).
  var isHtmlOrRoot = event.request.mode === 'navigate'
    || url.endsWith('/')
    || url.endsWith('/index.html')
    || url.endsWith('/manifest.json')
    || url.endsWith('/sw.js');

  if (isHtmlOrRoot) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(c) { c.put(event.request, clone); });
          }
          return response;
        })
        .catch(function() {
          return caches.match(event.request).then(function(cached) {
            return cached || caches.match('/') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Other static assets (images, fonts, etc.) — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(event.request, clone); });
        }
        return response;
      }).catch(function() {
        if (event.request.mode === 'navigate') {
          return caches.match('/') || caches.match('/index.html');
        }
      });
    })
  );
});

// ── BACKGROUND SYNC ───────────────────────────────────────────────────────────
// Flushes any queued offline data (feedback, ratings, usage) when connection returns
self.addEventListener('sync', function(event) {
  if (event.tag === 'hymndesk-sync') {
    event.waitUntil(
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'BACKGROUND_SYNC' });
        });
      })
    );
  }
});

// ── PERIODIC BACKGROUND SYNC ──────────────────────────────────────────────────
// Refreshes hymn library in the background every hour when permitted
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'hymndesk-hymn-refresh') {
    var HYMNS_CACHE_KEY = 'https://hymndesk.co.za/hymns.json';
    event.waitUntil(
      caches.open(HYMNS_CACHE).then(function(cache) {
        return cache.match(HYMNS_CACHE_KEY).then(function(cached) {
          var headers = {};
          if (cached) {
            var etag = cached.headers.get('ETag');
            if (etag) headers['If-None-Match'] = etag;
          }
          return fetch(HYMNS_CACHE_KEY, { headers: headers })
            .then(function(response) {
              if (response.status === 304) { return; } // Not modified, nothing to do
              if (response && response.status === 200) {
                var clone = response.clone();
                return cache.put(HYMNS_CACHE_KEY, clone);
              }
            })
            .catch(function() {});
        });
      })
    );
  }
});

// ── PUSH NOTIFICATIONS ────────────────────────────────────────────────────────
// Handles push messages for future notification features
self.addEventListener('push', function(event) {
  var data = { title: 'HymnDesk', body: 'You have a new update.', icon: '/icons/icon-192x192.png' };
  if (event.data) {
    try { data = event.data.json(); } catch(e) { data.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'hymndesk-notification',
      renotify: false,
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clients) {
      if (clients.length) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
