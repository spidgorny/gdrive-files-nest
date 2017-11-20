import * as fs from "fs";
import {LoginService} from "./login/LoginService";
import {Res} from "@nestjs/common";
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
// import { template } from './es6-template-literals';
const handlebars = require('handlebars');
import {Response} from "express";

export class BaseController {

	templateFile = 'template/bootstrap.html';

	loginService: LoginService;

	protected async renderTemplate(content: string) {
		const html = await readFileAsync(this.templateFile);
		// console.log(html.length);
		// console.log(html);	// Buffer
		// console.log(html.toString().length);
		return handlebars.compile(html.toString())({content});
	}

	protected login(@Res() response: Response) {
		if (!this.loginService.isAuth()) {
			response.location('/');
		}
	}

	protected error(message) {
		return `<div class="bg-danger">${ message }</div>`;
	}

}
