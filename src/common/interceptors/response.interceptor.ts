import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {// TODO: Add return type
        return next.handle().pipe(
            map((data) => {
                return {
                    message: "Success",
                    data: data ?? {},
                };
            }),
        );
    }
}
