import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
})
