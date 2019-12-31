import { PostResolver } from './../modules/post/PostResolver';
import { TagResolver } from './../modules/tag/TagResolver';
import { buildSchema } from "type-graphql";
import { UserResolver } from '../modules/user/UserResolver';

export const createSchema = () => buildSchema({
    resolvers: [
        UserResolver,
        TagResolver,
        PostResolver
    ]
});