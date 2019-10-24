import { Tag } from './../../entity/Tag';
import { Resolver, Mutation, Arg, Query } from "type-graphql";

@Resolver(of => Tag)
export class TagResolver {

    @Query(returns => [Tag])
    async getTags(): Promise<Tag[]> {
        return await Tag.find();
    }

    @Query(returns => Tag)
    async getTagById(@Arg("tagId") tagId: string): Promise<Tag> {
        const tag: Tag = await Tag.findOne({ where: { id: tagId } });
        if (!tag) {
            throw new Error("User Not Found");
        }

        return tag;
    }

    @Mutation(returns => Tag)
    async createTag(@Arg("name") name: string): Promise<Tag> {
        return await Tag.create({ name }).save();
    }
}
