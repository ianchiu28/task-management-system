import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    #host: string;
    #port: number;
    #username: string;
    #password: string;
    #database: string;

    constructor(private readonly configService: ConfigService) {
        this.#host = this.configService.get<string>("DATABASE_HOST");
        this.#port = this.configService.get<number>("DATABASE_PORT");
        this.#username = this.configService.get<string>("DATABASE_USERNAME");
        this.#password = this.configService.get<string>("DATABASE_PASSWORD");
        this.#database = this.configService.get<string>("DATABASE_NAME");
    }

    createTypeOrmOptions():
        | Promise<TypeOrmModuleOptions>
        | TypeOrmModuleOptions {
        return {
            type: "postgres",
            host: this.#host,
            port: this.#port,
            username: this.#username,
            password: this.#password,
            database: this.#database,
            entities: ["dist/**/*.entity{.ts,.js}"],
            synchronize: true,
            logging: true,
        };
    }
}
