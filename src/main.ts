import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { HttpExceptionFilter } from "./common/exceptionFilters";
import { ResponseInterceptor } from "./common/interceptors";
import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("Task Management System API")
        .setDescription("The Task Management System API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
