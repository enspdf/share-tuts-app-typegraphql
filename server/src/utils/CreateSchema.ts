import { TagResolver } from './../modules/tag/tag.resolver';
import { PostResolver } from './../modules/post/post.resolver';
import { buildSchema } from "type-graphql";
import { UserResolver } from '../modules/user/user.resolver';
import { Container } from "typedi";
import path from "path";

export const createSchema = () => buildSchema({
    resolvers: [
        UserResolver,
        TagResolver,
        PostResolver
    ],
    container: Container,
    emitSchemaFile: path.resolve(__dirname, "snapshot/schema", "schema.gql")
});