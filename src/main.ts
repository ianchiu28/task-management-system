import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { HttpExceptionFilter } from "./common/exceptionFilters";
import { ResponseInterceptor } from "./common/interceptors";
import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
