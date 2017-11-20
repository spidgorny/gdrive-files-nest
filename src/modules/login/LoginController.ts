import {Controller, Get, Res} from '@nestjs/common'
import { BaseController } from '../BaseController'
import {LoginService} from "./LoginService";
import {Response} from "express";

@Controller()
export class LoginController extends BaseController {

	loginService: LoginService;

	constructor() {
		super();
		this.loginService = new LoginService();
	}


	@Get()
	async index(@Res() response: Response) {
		let content: string;
		try {
			if (this.loginService.isAuth()) {
				const listFiles = '/listFiles';
				content = this.success(`Login already. Redirecting to <a href="${ listFiles }">List Files</a>`);
				//response.location('showFiles');
			} else {
				let loginURI = await this.loginService.getLoginURI();
				content = `<a href="${ loginURI }">Login with Google account</a> here:<br/>${ loginURI }`;
			}
		} catch (error) {
			console.error(error);
			content = this.error(error);
		}
		console.log(content);
		content = await this.renderTemplate(content);
		console.log(content.length);
		response.type('html').send(content);
		// console.log(response);
	}

	@Get('static')
	staticPage(@Res() response: Response) {
		response.send(`static html`);
	}

	@Get('staticreturn')
	staticReturn() {
		return(`static html`);
	}

}
