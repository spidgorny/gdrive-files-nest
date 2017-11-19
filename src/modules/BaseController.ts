import * as fs from "fs";
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
// import { template } from './es6-template-literals';
const handlebars = require('handlebars');

export class BaseController {

	templateFile = 'template/bootstrap.html';

	protected async renderTemplate(content: string) {
		const html = await readFileAsync(this.templateFile);
		// console.log(html.length);
		// console.log(html);	// Buffer
		// console.log(html.toString().length);
		return handlebars.compile(html.toString())({content});
	}
}
