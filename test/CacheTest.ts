const cache = require('node-file-cache').create({
    file: '.credentials/file-cache.json',
    life: 60 * 60 * 24,
});  // default configuration

const key = 'drive-files';
let cachedItem = cache.get(key);
if (!cachedItem) {
    console.log('set');
    cache.set(key, [
        'file1', 'file2'
    ]);
    cachedItem = cache.get(key);
}

console.log(cachedItem);
