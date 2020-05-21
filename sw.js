/* https://blog.angular-university.io/service-workers/ */
const VERSION = 'v4';

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
        'https://bluetac.de/Spyfall/js/customElements/BlueTac/message.js',
        'https://bluetac.de/Spyfall/img/jake-kay-bank-vault-door.jpg',
        'https://bluetac.de/Spyfall/img/garage_by_gregmks-d64ydjo.jpg',
        'https://bluetac.de/Spyfall/img/homer_spy.jpeg',
        'https://bluetac.de/Spyfall/img/titanic.jpg',
        'https://bluetac.de/Spyfall/img/city_shop.jpg',
        'https://bluetac.de/Spyfall/img/polar_science.jpg',
        'https://bluetac.de/Spyfall/img/school.jpg',
        'https://bluetac.de/Spyfall/data/playAreas.json',
        'https://bluetac.de/Spyfall/sounds/alarm_beep.wav',
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

self.addEventListener('fetch', event => {
    //respond immediately from cache
    event.respondWith(cacheThenNetwork(event));
    //update the cache
    event.waitUntil(updateCache(event));
});
async function cacheThenNetwork(event) {
    const cache = await caches.open(getCacheName());
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('Serving from Cache: ' + event.request.url);
        return cachedResponse;
    }

    const networkResponse = await fetch(event.request);

    log('Calling network: ' + event.request.url);

    return networkResponse;
}
function updateCache(event) {
    const request = event.request;
    return caches.open(getCacheName()).then(function (cache) {
        return fetch(request).then(function (response) {
            log('Updating Cache: ' + response.url);
            return cache.put(request, response);
        });
    });
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
