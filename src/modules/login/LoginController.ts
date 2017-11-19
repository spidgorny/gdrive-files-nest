import { Controller, Get } from '@nestjs/common'
import * as fs from "fs";
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
import { template } from '../es6-template-literals';
const handlebars = require('handlebars');

@Controller()
export class LoginController {
	@Get()
	render() {
		let content = '<a href="#">Login with Google account</a>';
		return this.renderTemplate(content);
	}

	protected async renderTemplate(content: string) {
		const html = await readFileAsync('template/bootstrap.html');
		// console.log(html.length);
		// console.log(html);	// Buffer
		// console.log(html.toString().length);
		return handlebars.compile(html.toString())({content});
	}

}
