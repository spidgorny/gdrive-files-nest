import * as fs from "fs";
import {TestFramework} from './TestFramework';
import {LoginServiceTest} from "./LoginServiceTest";

function first(obj: any) {
	const keys = Object.keys(obj);
	if (keys.length) {
		return obj[keys[0]];
	} else {
		return null;
	}
}

export class TestRunner {

	folder: string;

	constructor(folder) {
		this.folder = folder;
	}

	run() {
		const files = fs.readdirSync(this.folder);
		for (let f of files) {
			if (f.indexOf('Test.ts') == f.length - 7) {
				const test = require('./' + f);
				let className = first(test);
				console.log('File: ', f, className);
				let i = eval("new " + className + "()");
				i.run();
			}
		}
	}

}

// new TestRunner(__dirname).run();
new LoginServiceTest().run().then(() => {
	console.log('TestRunner done');
});
