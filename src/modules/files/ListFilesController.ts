import {Controller, Get, Res} from '@nestjs/common'
import { BaseController } from '../BaseController'
import {LoginService} from "../login/LoginService";
import {Response} from "express";

@Controller()
export class ListFilesController extends BaseController {

	loginService: LoginService;

	constructor() {
		super();
		this.loginService = new LoginService();
	}

	@Get('/listFiles')
	render(@Res() response: Response) {
		let content;
		try {
			this.login(response);	// will redirect to login page if needed
			content = `<h1>files</h1>`;
			return this.renderTemplate(content);
		} catch (error) {
			console.error(error);
		}
	}

}
