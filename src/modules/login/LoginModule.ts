import { Module } from '@nestjs/common';
import { LoginController } from './LoginController';
import {CatchLoginController} from "./CatchLoginController";
import {LoginService} from './LoginService';
import {ConnectionFactory} from '../ConnectionFactory';

@Module({
	controllers: [LoginController, CatchLoginController],
    components: [ConnectionFactory],
	exports: [],
	modules: []
})
export class LoginModule {}
