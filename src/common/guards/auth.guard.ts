import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

import { ERROR_PREFIX } from "../constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException(`
                ${ERROR_PREFIX.UNAUTHORIZED}: Authorization header is missing
            `);
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = this.jwtService.verify(token);
            request.user = {
                email: decoded.sub,
            };
            return true;
        } catch (error) {
            throw new UnauthorizedException(`
                ${ERROR_PREFIX.UNAUTHORIZED}: Invalid token
            `);
        }
    }
}
