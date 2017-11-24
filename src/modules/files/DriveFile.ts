export class DriveFile {

	id: string;
	name: string;
	parents: string[];
	mimeType: string;
	modifiedTime: string;
	trashed: boolean;
    webViewLink: string;

	children: DriveFile[];

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

    isNew() {
		const diff = 1000 * 60 * 60 * 24 * 60;
        const lastWeek = new Date(
            new Date().getTime() - diff);
        return new Date(this.modifiedTime) > lastWeek;
    }

}
