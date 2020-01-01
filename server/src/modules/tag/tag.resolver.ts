import { isAuth } from './../../middleware/IsAuthMiddleware';
import { Tag } from './../../entity/Tag';
import { Resolver, Query, UseMiddleware, Arg, Mutation } from 'type-graphql';
import { Service } from "typedi";
import { TagService } from './tag.service';

@Service()
@Resolver(of => Tag)
export class TagResolver {
    constructor(private readonly tagService: TagService) { }

    @Query(returns => [Tag])
    @UseMiddleware(isAuth)
    async getTags(): Promise<Tag[]> {
        return this.tagService.getTags();
    }

    @Query(returns => Tag)
    @UseMiddleware(isAuth)
    async getTagById(@Arg("id") tagId: string): Promise<Tag> {
        return this.tagService.getTagById(tagId);
    }

    @Mutation(returns => Tag)
    @UseMiddleware(isAuth)
    async createTag(@Arg("name") name: string): Promise<Tag> {
        return this.tagService.createTag(name);
    }

    @Mutation(returns => Tag)
    @UseMiddleware(isAuth)
    async updateTag(@Arg("id") tagId: string, @Arg("name") name: string): Promise<Tag> {
        return this.tagService.updateTag(tagId, name);
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async deleteTag(@Arg("id") tagId: string): Promise<Boolean> {
        return this.tagService.deleteTag(tagId);
    }
}