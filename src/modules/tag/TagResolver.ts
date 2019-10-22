import { Tag } from './../../entity/Tag';
import { Resolver, Mutation, Arg, Query } from "type-graphql";

@Resolver(of => Tag)
export class TagResolver {

    @Query(returns => [Tag])
    async getTags(): Promise<Tag[]> {
        return await Tag.find();
    }

    @Mutation(returns => Tag)
    async createTag(@Arg("name") name: string): Promise<Tag> {
        return await Tag.create({ name }).save();
    }
}
