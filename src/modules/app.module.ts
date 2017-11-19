import { Module } from '@nestjs/common';
import { LoginModule } from "./login/LoginModule";

@Module({
    modules: [LoginModule],
})
export class ApplicationModule {}
