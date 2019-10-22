import { createSchema } from './utils/CreateSchema';
import "dotenv/config";
import "reflect-metadata";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as cors from "cors";
import { ApolloServer } from "apollo-server";
import { createTypeormConnection } from "./utils/CreateTypeormConnection";

(async () => {
    const app = express();

    app.use(cookieParser());
    app.use(cors());
    app.use(session({
        //store: "",
        name: "qid",
        secret: "FjXcJ0I2ThdmUOFSUdS1VFRexkhCMHyx",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365
        }
    }));

    await createTypeormConnection();

    const schema = await createSchema();

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res })
    });

    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL available at ${url}`);
})();