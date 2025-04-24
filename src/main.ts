import { writeFileSync } from "fs";
import { join } from "path";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as yaml from "js-yaml";

import { HttpExceptionFilter } from "./common/exceptionFilters";
import { ResponseInterceptor } from "./common/interceptors";
import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: true, // Allow all origins
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("Task Management System API")
        .setDescription("The Task Management System API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    // 匯出 Swagger 文檔 (YAML)
    const outputPath = join(process.cwd(), "swagger");
    writeFileSync(join(outputPath, "swagger.yaml"), yaml.dump(document));

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
