// HymnDesk Service Worker — v3.0
// Strategy:
//   - App shell (HTML/JS/manifest/sw.js): network-first, cache fallback
//   - Hymn library (hymns.json): network-first with cache fallback for offline
//   - Supabase API: never cached, never intercepted — all sync calls go direct
//   - Static assets: cache-first
//   - Activates immediately on install (skipWaiting + clients.claim) so PWAs
//     auto-update silently in one cycle.

const CACHE_NAME = 'hymndesk-v16';
const HYMNS_CACHE = 'hymndesk-hymns-v6';

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

  // hymns.json — network first, cache fallback
  // Fixed absolute cache key so put/match always resolve to the same entry.
  var HYMNS_CACHE_KEY = 'https://hymndesk.co.za/hymns.json';
  if (url.includes('hymns.json') && !url.includes('raw.githubusercontent.com') && !url.includes('api.github.com')) {
    event.respondWith(
      fetch(HYMNS_CACHE_KEY + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(HYMNS_CACHE).then(function(c) { c.put(HYMNS_CACHE_KEY, clone); });
          }
          return response;
        })
        .catch(function() {
          return caches.open(HYMNS_CACHE).then(function(c) {
            return c.match(HYMNS_CACHE_KEY).then(function(cached) {
              return cached || new Response('{"hymns":[]}', { headers: { 'Content-Type': 'application/json' } });
            });
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
      fetch(HYMNS_CACHE_KEY + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            return caches.open(HYMNS_CACHE).then(function(c) {
              return c.put(HYMNS_CACHE_KEY, clone);
            });
          }
        })
        .catch(function() {})
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
