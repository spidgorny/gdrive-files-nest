export class DriveFile {

	id: string;
	name: string;
	parents: [string];

	constructor(struct: any) {
		for (let key in struct) {
			if (struct.hasOwnProperty(key)) {
				this[key] = struct[key];
			}
		}
	}

}
