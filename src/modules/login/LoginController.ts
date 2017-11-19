import { Controller, Get } from '@nestjs/common'
import { BaseController } from '../BaseController'
import {LoginService} from "./LoginService";

@Controller()
export class LoginController extends BaseController {

	loginService: LoginService;

	constructor() {
		super();
		this.loginService = new LoginService();
	}

	@Get()
	async render() {
		let content;
		try {
			if (this.loginService.isAuth()) {
				content = 'Login already. Redirect';
				return this.renderTemplate(content);
			}
			let loginURI = await this.loginService.getLoginURI();
			content = `<a href="${ loginURI }">Login with Google account</a> here:<br/>${ loginURI }`;
			return this.renderTemplate(content);
		} catch (error) {
			console.error(error);
		}
	}

}
