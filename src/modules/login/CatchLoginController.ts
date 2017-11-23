import {Controller, Get, Query} from '@nestjs/common'
import { BaseController } from '../BaseController'
import {LoginService} from "./LoginService";

@Controller()
export class CatchLoginController extends BaseController {

	constructor(protected readonly loginService: LoginService) {
		super(loginService);
	}

	@Get('catchLogin')
	async render(@Query('code') code) {
		let content;
		try {
			console.log(code);
			const token = await this.loginService.catchLogin(code);
			console.log(token);
			content = this.success('Login successful. Go to <a href="listFiles" class="btn btn-primary">List Files</a>');
			return this.renderTemplate(content);
		} catch (error) {
			console.error(error);
		}
	}

}
