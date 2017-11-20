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

	templateTime;

	templateFunc;

	loginService: LoginService;

	protected async renderTemplate(content: string) {
		if (!this.templateFunc) {
			const html = await readFileAsync(this.templateFile);
			// console.log(html.length);
			// console.log(html);	// Buffer
			// console.log(html.toString().length);
			this.templateFunc = handlebars.compile(html.toString());
		}
		const html = await readFileAsync(this.templateFile);
		this.templateFunc = handlebars.compile(html.toString());
		return this.templateFunc({content}).toString();
	}

	protected login(@Res() response: Response) {
		if (!this.loginService.isAuth()) {
			response.location('/');
		}
	}

	protected error(message) {
		return `<div class="p-3 mb-2 bg-danger text-white">${ message }</div>`;
	}

	protected success(message) {
		return `<div class="p-3 mb-2 bg-success text-white">${ message }</div>`;
	}

}
