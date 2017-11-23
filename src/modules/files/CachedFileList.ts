import {FileLister} from './FileLister';

export class CachedFileList {

    cache;

    constructor(protected readonly fileLister: FileLister) {
        this.cache = require('node-file-cache').create({
            file: '.credentials/file-cache.json',
            life: 60 * 60 * 24,
        });
    }

    async listAllFiles() {
        const key = 'drive-files';
        let cachedItem = this.cache.get(key);
        if (!cachedItem) {
            let data = await this.fileLister.listAllFiles();
            console.log('set');
            this.cache.set(key, data);
            cachedItem = this.cache.get(key);
        }
        return cachedItem;
    }

}
