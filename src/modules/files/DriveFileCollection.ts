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

    addChildren(folders: DriveFile[]) {
	    return folders.map(dir => {
	       dir.children = this.getChildren(dir);
	       return dir;
        });
    }

    findById(id: string) {
        const list = this.files.filter((el) => {
            return el.id == id;
        });
        if (list.length) {
            return list[0];
        }
        return null;
    }
}
