export class TestFramework {

	constructor() {

	}

	run() {
		const testFunctions1 = Object.getOwnPropertyNames(this);
		console.log(testFunctions1);
		let testFunctions = [];
		for (let p in this) {
			console.log('prop', p);
			if (this.hasOwnProperty(p)
				&& typeof this[p] === 'function'
				&& p.indexOf('test') == 0) {
				testFunctions.push(p);
			}
		}
		// console.log(testFunctions);
		for (let method of testFunctions) {
			console.log('=== ', method, ' ===');
			this[method].call(this);
		}
	}

	error(message, is, must) {
		console.error(message, is, must);
	}

	assertEquals(must, is, message?: string) {
		if (must == is) {
			console.log(message, 'OK');
		} else {
			this.error(message, is, must);
		}
	}

	assertInstanceOf(must, is, message?: string) {
		if (is instanceof must) {
			console.log(message, 'OK');
		} else {
			this.error(message, is, must);
		}
	}

}
