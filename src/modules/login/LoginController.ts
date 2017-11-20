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
	async render(@Res() response: Response) {
		//return new Promise(async (resolve, reject) => {
			let content;
			try {
				if (this.loginService.isAuth()) {
					content = 'Login already. Redirect';
					//response.location('showFiles');
					return this.renderTemplate(content);
				}
				let loginURI = await this.loginService.getLoginURI();
				content = `<a href="${ loginURI }">Login with Google account</a> here:<br/>${ loginURI }`;
				let html = this.renderTemplate(content);
				// resolve(html);
				return html;
			} catch (error) {
				console.error(error);
				let html = this.renderTemplate(this.error(error));
				// resolve(html);
				return html;
			}
		//});
	}

}
