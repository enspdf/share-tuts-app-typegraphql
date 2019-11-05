import { isAuth } from './../../middleware/IsAuthMiddleware';
import { Tag } from './../../entity/Tag';
import { Resolver, Mutation, Arg, Query, UseMiddleware } from "type-graphql";

@Resolver(of => Tag)
export class TagResolver {
    @Query(returns => [Tag])
    @UseMiddleware(isAuth)
    async getTags(): Promise<Tag[]> {
        return await Tag.find();
    }

    @Query(returns => Tag)
    @UseMiddleware(isAuth)
    async getTagById(@Arg("tagId") tagId: string): Promise<Tag> {
        const tag: Tag = await Tag.findOne({ where: { id: tagId } });
        if (!tag) {
            throw new Error("Tag Not Found");
        }

        return tag;
    }

    @Mutation(returns => Tag)
    @UseMiddleware(isAuth)
    async createTag(@Arg("name") name: string): Promise<Tag> {
        return await Tag.create({ name }).save();
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async deleteTag(@Arg("tagId") tagId: string): Promise<boolean> {
        try {
            await Tag.delete({ id: tagId });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}
