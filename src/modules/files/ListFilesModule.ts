import { Module } from '@nestjs/common';
import { ListFilesController } from './ListFilesController';
import {LoginService} from "../login/LoginService";

@Module({
	controllers: [ListFilesController],
	components: [LoginService],
	exports: [],
	modules: [],
})
export class ListFilesModule {}
