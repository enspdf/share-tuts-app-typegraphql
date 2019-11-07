import { createSchema } from './utils/CreateSchema';
import "dotenv/config";
import "reflect-metadata";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as cors from "cors";
import { ApolloServer } from "apollo-server";
import { createTypeormConnection } from "./utils/CreateTypeormConnection";
import { redis } from "./utils/Redis";
import * as connectRedis from "connect-redis";

(async () => {
    const app = express();
    const RedisStore = connectRedis(session);

    app.use(cookieParser());
    app.use(cors());
    app.use(session({
        store: new RedisStore({
            client: redis as any
        }),
        name: "qid",
        secret: process.env.SESSION_SECRET!,
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
        context: ({ req, res }) => ({ req, res }),
        formatError: error => {
            const { message, extensions, path } = error;
            return {
                message,
                code: extensions.code,
                path
            };
        }

    });

    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL available at ${url}`);
})();