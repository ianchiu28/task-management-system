import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtConfig } from "../../common/config/jwt.config";

import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
    imports: [
        JwtModule.registerAsync({ useClass: JwtConfig }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
