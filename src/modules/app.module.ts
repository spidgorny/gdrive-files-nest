import { Module } from '@nestjs/common';
import { LoginModule } from "./login/LoginModule";
import {ListFilesModule} from "./files/ListFilesModule";

@Module({
    modules: [LoginModule, ListFilesModule],
})
export class ApplicationModule {}
