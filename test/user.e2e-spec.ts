import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";

import { HttpExceptionFilter } from "../src/common/exceptionFilters";
import { ResponseInterceptor } from "../src/common/interceptors";
import { AppModule } from "../src/modules/app/app.module";
import { UserEntity } from "../src/modules/user/user.entity";

describe("User E2E Test", () => {
    let app: INestApplication;
    let accessToken: string;

    const email = "test@example.com";
    const username = "username";
    const password = "password";
    const newPassword = "newPassword";

    beforeEach(async () => {
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
                        entities: [UserEntity],
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
    });

    afterEach(async () => {
        await app.close();
    });

    describe("POST /users", () => {
        const user = {
            email,
            username,
            password,
        };

        it("should create a new user", () => {
            return request(app.getHttpServer())
                .post("/users")
                .send(user)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        message: "Success",
                        data: {},
                    });
                });
        });

        it("should fail to create duplicate user", () => {
            return request(app.getHttpServer())
                .post("/users")
                .send(user)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toContain("User already exists");
                });
        });
    });

    describe("POST /users/login", () => {
        it("should login successfully and return access token", () => {
            return request(app.getHttpServer())
                .post("/users/login")
                .send({
                    email,
                    password,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toHaveProperty("accessToken");
                    expect(typeof res.body.data.accessToken).toBe("string");
                    accessToken = res.body.data.accessToken;
                });
        });

        it("should fail to login with wrong password", () => {
            return request(app.getHttpServer())
                .post("/users/login")
                .send({
                    email,
                    password: "wrongpassword",
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Incorrect email or password",
                    );
                });
        });
    });

    describe("PATCH /users/password", () => {
        it("should fail to change password without auth token", () => {
            return request(app.getHttpServer())
                .patch("/users/password")
                .send({
                    oldPassword: password,
                    newPassword,
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should fail to change password with wrong old password", () => {
            return request(app.getHttpServer())
                .patch("/users/password")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    oldPassword: "wrongpassword",
                    newPassword,
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Incorrect old password",
                    );
                });
        });

        it("should change password successfully", () => {
            return request(app.getHttpServer())
                .patch("/users/password")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    oldPassword: password,
                    newPassword,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        message: "Success",
                        data: {},
                    });
                });
        });
    });

    describe("POST /users/delete", () => {
        it("should fail to delete user without auth token", () => {
            return request(app.getHttpServer())
                .post("/users/delete")
                .send({
                    password: newPassword,
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        "Authorization header is missing",
                    );
                });
        });

        it("should fail to delete user with wrong password", () => {
            return request(app.getHttpServer())
                .post("/users/delete")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    password: "wrongpassword",
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toContain("Incorrect password");
                });
        });

        it("should delete user successfully", () => {
            return request(app.getHttpServer())
                .post("/users/delete")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    password: newPassword,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        message: "Success",
                        data: {},
                    });
                });
        });
    });
});
