// Service worker: shows push notifications and focuses the app when one is tapped.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
  const show = self.registration.showNotification(data.title || '¿De aquí a dónde?', {
    body: data.body || '',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: data.tag,
    data: { url: data.url || '/' },
  });
  const badge = self.navigator && self.navigator.setAppBadge ? self.navigator.setAppBadge(1).catch(() => {}) : Promise.resolve();
  event.waitUntil(Promise.all([show, badge]));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
