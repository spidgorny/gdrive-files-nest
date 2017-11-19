import { Module } from '@nestjs/common';
import { LoginController } from './LoginController';

@Module({
	controllers: [LoginController],
//	components: [CatsService],
})
export class LoginModule {}
