export class DriveFile {

	id: string;
	name: string;
	parents: string[];
	mimeType: string;
	modifiedTime: string;

	constructor(struct: any) {
		for (let key in struct) {
			if (struct.hasOwnProperty(key)) {
				this[key] = struct[key];
			}
		}
	}

    getParent() {
        return ('parents' in this && this.parents.length)
			? this.parents[0]
			: null;
    }
}
