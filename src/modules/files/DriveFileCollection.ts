import {DriveFile} from './DriveFile';

export class DriveFileCollection {

	constructor(protected files: DriveFile[]) {
	}

	setFiles(files) {
		this.files = files;
	}

	getRootFiles() {
		const idList = this.files.map((el: DriveFile) => {
			return el.id;
		});
		//console.log(idList);
		return this.files.filter((el: DriveFile) => {
			return -1 == idList.indexOf(el.getParent());
		});
	}

	getChildren(file: DriveFile) {
		return this.files.filter((el: DriveFile) => {
		   return el.getParent() == file.id;
		});
	}

	getOnlyFolders(folders: DriveFile[]) {
		return folders.filter(el => {
		   return this.isFolder(el);
		});
	}

	isFolder(file: DriveFile) {
	    return this.files.filter(el => {
	        return el.getParent() == file.id;
        }).length;
    }

}
