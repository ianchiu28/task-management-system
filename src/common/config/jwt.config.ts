import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
    #secret: string;
    #expiresIn: string;
    #issuer: string;

    constructor(private readonly configService: ConfigService) {
        this.#secret = this.configService.get<string>("JWT_SECRET");
        this.#expiresIn = this.configService.get<string>("JWT_EXPIRES_IN");
        this.#issuer = this.configService.get<string>("JWT_ISSUER");
    }

    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.#secret,
            signOptions: {
                expiresIn: this.#expiresIn,
                issuer: this.#issuer,
            },
        };
    }
}
