import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseConfig } from "../../common/config";
import { TaskModule } from "../task/task.module";
import { UserModule } from "../user/user.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
        UserModule,
        TaskModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
