import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

import { AppModule } from "../src/modules/app/app.module";

describe("App E2E Test", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("/health (GET)", () => {
        return request(app.getHttpServer())
            .get("/health")
            .expect(200)
            .expect("Server is up and running!");
    });
});
