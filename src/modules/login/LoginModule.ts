import { Module } from '@nestjs/common';
import { LoginController } from './LoginController';
import {CatchLoginController} from "./CatchLoginController";

@Module({
	controllers: [LoginController, CatchLoginController],
	components: [],
	exports: [],
	modules: []
})
export class LoginModule {}
