import { createSchema } from './utils/CreateSchema';
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { createTypeormConnection } from "./utils/CreateTypeormConnection";
import { redis } from "./utils/Redis";
import connectRedis from "connect-redis";
import { Container } from "typedi";
import { useContainer } from "typeorm";
import { confirmEmail } from "./routes/confirm.route";
import { refreshToken } from "./routes/token.route";

const RedisStore = connectRedis(session);
const PORT = process.env.PORT || 4000;

useContainer(Container);

(async () => {

    await createTypeormConnection();

    const app = express();

    const server = new ApolloServer({
        schema: await createSchema(),
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

    app.use(cookieParser());
    app.use(cors({ credentials: true }));
    app.use(session({
        store: new RedisStore({
            client: redis as any
        }),
        name: "qid",
        secret: process.env.SESSION_SECRET! || "SESSION_SECRET",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365
        }
    }));

    app.get("/confirm/:token", confirmEmail);
    app.post("/refresh_token", refreshToken);

    server.applyMiddleware({ app, cors: false });

    const nodeServer = app.listen(PORT, () => {
        console.log(`Server is running, GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
    });
})();