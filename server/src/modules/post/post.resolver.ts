import { Context } from './../../utils/Context';
import { isAuth } from './../../middleware/IsAuthMiddleware';
import { Post } from './../../entity/Post';
import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg } from 'type-graphql';
import { Service } from "typedi";
import { PostService } from './post.service';
import { PostInput } from './types/PostInput.input';
import { GenericPost } from './types/GenericPost.input';

@Service()
@Resolver(of => Post)
export class PostResolver {
    constructor(private readonly postService: PostService) { }

    @Query(returns => [Post])
    @UseMiddleware(isAuth)
    async myPosts(@Ctx() { payload }: Context): Promise<Post[]> {
        return this.postService.myPosts(payload!.userId);
    }

    @Query(returns => [Post])
    @UseMiddleware(isAuth)
    async allPosts(): Promise<Post[]> {
        return this.postService.allPosts();
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async createPost(@Arg("input") postInput: PostInput, @Ctx() { payload }: Context): Promise<Boolean> {
        return this.postService.createPost(postInput, payload!.userId);
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async updatePost(@Arg("id") postId: string, @Arg("input") postInput: GenericPost): Promise<Boolean> {
        return this.postService.updatePost(postId, postInput);
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async publishPost(@Arg("id") postId: string): Promise<Boolean> {
        return this.postService.publishPost(postId);
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(@Arg("id") postId: string): Promise<Boolean> {
        return this.postService.deletePost(postId);
    }
}