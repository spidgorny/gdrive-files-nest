import {DriveFile} from './DriveFile';

export class DriveFileCollection {

    constructor(protected readonly files: DriveFile[]) {

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
}
