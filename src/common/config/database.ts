import { DataSource } from "typeorm";

export const DatabaseConfig = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "password",
    database: "task_management",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
    logging: true,
});
