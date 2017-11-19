import { Module } from '@nestjs/common';
import { LoginController } from "./login/LoginController";
import { LoginModule } from "./login/LoginModule";

@Module({
    modules: [LoginModule],
})
export class ApplicationModule {}
