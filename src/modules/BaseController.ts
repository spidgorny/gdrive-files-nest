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

	constructor(protected readonly loginService: LoginService) {

	}

	protected async renderTemplate(content: string) {
		if (!this.templateFunc) {
			const html = await readFileAsync(this.templateFile);
			// console.log(html.length);
			// console.log(html);	// Buffer
			// console.log(html.toString().length);
			this.templateFunc = handlebars.compile(html.toString());
		}
		const template = await readFileAsync(this.templateFile);
		this.templateFunc = handlebars.compile(template.toString());
		//console.log(this.templateFunc);
		const html = this.templateFunc({content});
		//console.log(html, typeof html);
		return html.toString();
	}

	/**
	 * Error: Can't set headers after they are sent.
	 * @param {e.Response} response
	 */
	protected loginOrRedirect(@Res() response: Response) {
		console.log('this.loginService.isAuth()', this.loginService.isAuth());
		if (!this.loginService.isAuth()) {
			response.location('/');
		}
		response.location('/').end();
	}

	protected loginOrException() {
		console.log('this.loginService.isAuth()', this.loginService.isAuth());
		if (!this.loginService.isAuth()) {
			throw new Error('Please login first <a href="/">here</a>');
		}
	}

	protected error(message) {
		return `<div class="p-3 mb-2 bg-danger text-white">${ message }</div>`;
	}

	protected success(message) {
		return `<div class="p-3 mb-2 bg-success text-white">${ message }</div>`;
	}

}
