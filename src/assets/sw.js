self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('cacheTitle').then(function(cache) {
			return cache.addAll([
				'index.html',
				'profile_update/index.html',
				'playground/index.html',
				'manifest.json',
				'sw.js',
				'images/favicon.png',
				'images/logo512.png',
				'images/logo192.png',
				'images/back.png',
				'images/peakd.png',
				'images/hivestats.png',
				'js/blokz.js',
				'js/aes256.min.js',
				'js/mdl-chips-input.js',
				'js/sanitize-html.js',
				'js/wordlist.js',
				'css/styles.css',
				'css/mdl-chips-input.css',
				'css/mdl-chips-input.css.map'
			]);
		})
	);
});


self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});