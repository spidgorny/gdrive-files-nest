import { Module } from '@nestjs/common';
import { ListFilesController } from './ListFilesController';
import {LoginService} from "../login/LoginService";
import {ConnectionFactory} from '../ConnectionFactory';

@Module({
	controllers: [ListFilesController],
    components: [ConnectionFactory],
	exports: [],
	modules: [],
})
export class ListFilesModule {}
