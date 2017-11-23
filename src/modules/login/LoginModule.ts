import { Module } from '@nestjs/common';
import { LoginController } from './LoginController';
import {CatchLoginController} from "./CatchLoginController";
import {LoginService} from './LoginService';

@Module({
	controllers: [LoginController, CatchLoginController],
    components: [LoginService],
	exports: [],
	modules: []
})
export class LoginModule {}
