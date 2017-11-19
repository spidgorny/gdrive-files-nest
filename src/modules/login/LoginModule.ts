import { Module } from '@nestjs/common';
import { LoginController } from './LoginController';
import {CatchLoginController} from "./CatchLoginController";

@Module({
	controllers: [LoginController, CatchLoginController],
//	components: [CatsService],
	exports: [],
	modules: [],
	components: []
})
export class LoginModule {}
