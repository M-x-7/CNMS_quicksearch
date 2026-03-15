const CACHE_NAME = 'hp-task-pro-v1';

// 離線時快取的檔案清單
const ASSETS = [
    './index.html',
    './manifest.json'
];

// 安裝：預先快取核心檔案
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 啟動：清除舊版快取
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// 攔截請求：優先用快取，失敗才走網路（離線優先）
self.addEventListener('fetch', event => {
    // 外部連結（cmweb）不攔截，讓瀏覽器正常開啟
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});
