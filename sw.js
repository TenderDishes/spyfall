/* https://blog.angular-university.io/service-workers/ */
const VERSION = 'v2';

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));
async function installServiceWorker() {
    log("Service Worker installation started ");
    const cache = await caches.open(getCacheName());

    return cache.addAll([
        'https://bluetac.de/Spyfall/',
        'https://bluetac.de/Spyfall/index.html',
        'https://bluetac.de/Spyfall/css/index.css',
        'https://bluetac.de/Spyfall/js/gameRoutine.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/locationGrid.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/startScreen.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/loadingOverlay.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/roleAssignment.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/gameRunning.js',
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/endScreen.js',
        'https://bluetac.de/Spyfall/img/background/vintage_car.jpg',
    ]);
}

self.addEventListener('activate', (e) => activateSW(e));
async function activateSW(e) {
    e.waitUntil(self.clients.claim());
    log('Service Worker activated');
    const cacheKeys = await caches.keys();

    cacheKeys.forEach(cacheKey => {
        if (cacheKey !== getCacheName() ) {
            caches.delete(cacheKey);
        }
    });
}

self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));
async function cacheThenNetwork(event) {
    const cache = await caches.open(getCacheName());
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('Serving From Cache: ' + event.request.url);
        return cachedResponse;
    }

    const networkResponse = await fetch(event.request);

    log('Calling network: ' + event.request.url);

    return networkResponse;
}

function getCacheName() {
    return "app-cache-" + VERSION;
}


function log(message, ...data) {
    if (data.length > 0) {
        console.log(VERSION, message, data);
    }
    else {
        console.log(VERSION, message);
    }
}
