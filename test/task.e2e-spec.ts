import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";

import { HttpExceptionFilter } from "../src/common/exceptionFilters";
import { ResponseInterceptor } from "../src/common/interceptors";
import { AppModule } from "../src/modules/app/app.module";
import { TaskEntity } from "../src/modules/task/task.entity";
import { UserEntity } from "../src/modules/user/user.entity";

describe("Task E2E Test", () => {
    let app: INestApplication;
    let accessToken: string;
    let taskUuid: string;

    const email = "test-task@example.com";
    const username = "username";
    const password = "password";
    const title = "Test Task";
    const description = "Test Description";
    const newTitle = "Updated Task";
    const newDescription = "Updated Description";
    const status = "inProgress";
    const nonExistentUuid = "123e4567-e89b-12d3-a456-426614174000";

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        type: "postgres",
                        host: configService.get("DATABASE_HOST"),
                        port: configService.get("DATABASE_PORT"),
                        username: configService.get("DATABASE_USERNAME"),
                        password: configService.get("DATABASE_PASSWORD"),
                        database: configService.get("DATABASE_NAME"),
                        entities: [UserEntity, TaskEntity],
                    }),
                    inject: [ConfigService],
                }),
                AppModule,
            ],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useGlobalInterceptors(new ResponseInterceptor());

        await app.init();

        // Create user and get access token
        await request(app.getHttpServer())
            .post("/users")
            .send({ email, username, password });

        const loginResponse = await request(app.getHttpServer())
            .post("/users/login")
            .send({ email, password });

        accessToken = loginResponse.body.data.accessToken;
    });

    afterAll(async () => {
        // Delete user
        await request(app.getHttpServer())
            .post("/users/delete")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ password });

        await app.close();
    });

    describe("POST /tasks", () => {
        it("should fail to create task without auth token", () => {
            return request(app.getHttpServer())
                .post("/tasks")
                .send({
                    title,
                    description,
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should create a task successfully", () => {
            return request(app.getHttpServer())
                .post("/tasks")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title,
                    description,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toHaveProperty("uuid");
                    expect(typeof res.body.data.uuid).toBe("string");
                    taskUuid = res.body.data.uuid;
                });
        });
    });

    describe("GET /tasks", () => {
        it("should fail to get tasks without auth token", () => {
            return request(app.getHttpServer())
                .get("/tasks")
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should get all tasks successfully", () => {
            return request(app.getHttpServer())
                .get("/tasks")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toHaveProperty("tasks");
                    expect(Array.isArray(res.body.data.tasks)).toBe(true);
                });
        });
    });

    describe("GET /tasks/:uuid", () => {
        it("should fail to get task without auth token", () => {
            return request(app.getHttpServer())
                .get(`/tasks/${taskUuid}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should get task by uuid successfully", () => {
            return request(app.getHttpServer())
                .get(`/tasks/${taskUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toHaveProperty("uuid", taskUuid);
                    expect(res.body.data).toHaveProperty("title", title);
                    expect(res.body.data).toHaveProperty(
                        "description",
                        description,
                    );
                });
        });

        it("should fail to get non-existent task", () => {
            return request(app.getHttpServer())
                .get(`/tasks/${nonExistentUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toContain("Task not found");
                });
        });
    });

    describe("PATCH /tasks/:uuid", () => {
        it("should fail to update task without auth token", () => {
            return request(app.getHttpServer())
                .patch(`/tasks/${taskUuid}`)
                .send({
                    title: newTitle,
                    description: newDescription,
                    status,
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should update task successfully", () => {
            return request(app.getHttpServer())
                .patch(`/tasks/${taskUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: newTitle,
                    description: newDescription,
                    status,
                })
                .expect(200);
        });

        it("should fail to update non-existent task", () => {
            return request(app.getHttpServer())
                .patch(`/tasks/${nonExistentUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: newTitle,
                    description: newDescription,
                    status,
                })
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toContain("Task not found");
                });
        });
    });

    describe("DELETE /tasks/:uuid", () => {
        it("should fail to delete task without auth token", () => {
            return request(app.getHttpServer())
                .delete(`/tasks/${taskUuid}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should delete task successfully", () => {
            return request(app.getHttpServer())
                .delete(`/tasks/${taskUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });

        it("should fail to delete non-existent task", () => {
            return request(app.getHttpServer())
                .delete(`/tasks/${nonExistentUuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toContain("Task not found");
                });
        });
    });
});
