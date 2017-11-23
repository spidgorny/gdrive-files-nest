import {FileLister} from './FileLister';
import {DriveFile} from './DriveFile';

export class CachedFileList {

	cache;

	constructor(protected readonly fileLister: FileLister) {
		this.cache = require('node-file-cache').create({
			file: '.credentials/file-cache.json',
			life: 60 * 60 * 24,
		});
	}

	async listAllFiles() {
	    let files;
		const key = 'drive-files';
		let cachedItem = this.cache.get(key);
		if (!cachedItem) {
			files = await this.fileLister.listAllFiles();
			console.log('set');
			this.cache.set(key, files);
			//cachedItem = this.cache.get(key);
		} else {
		    files = cachedItem.map(row => new DriveFile(row));
        }
		return files;
	}

}
