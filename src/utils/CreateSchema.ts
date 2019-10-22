import { TagResolver } from './../modules/tag/TagResolver';
import { buildSchema } from "type-graphql";

export const createSchema = () => buildSchema({
    resolvers: [
        TagResolver
    ]
});