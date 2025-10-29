import { Sequelize } from "sequelize";
import 'dotenv/config';

const db = new Sequelize(process.env.NAME_DB,process.env.USER_DB, process.env.PASS_DB, {
    host: process.env.HOST_DB,
    port: 3306,
    dialect: "mysql",
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default db;