import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtConfig } from "../../common/config/jwt.config";

import { TaskController } from "./task.controller";
import { TaskEntity } from "./task.entity";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";

@Module({
    imports: [
        JwtModule.registerAsync({ useClass: JwtConfig }),
        TypeOrmModule.forFeature([TaskEntity]),
    ],
    controllers: [TaskController],
    providers: [TaskService, TaskRepository],
})
export class TaskModule {}
