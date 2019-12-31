import { User } from './../../entity/User';
import { Context } from './../../utils/Context';
import { PostInput } from './types/PostInput';
import { isAuth } from './../../middleware/IsAuthMiddleware';
import { Post } from './../../entity/Post';
import { Resolver, Mutation, UseMiddleware, Arg, Ctx, Query } from "type-graphql";
import { Tag } from '../../entity/Tag';
import { In } from 'typeorm';

@Resolver(of => Post)
export class PostResolver {
    @Query(returns => [Post])
    @UseMiddleware(isAuth)
    async myPosts(@Ctx() { payload }: Context): Promise<Post[]> {
        let posts: Post[];

        try {
            posts = await Post.createQueryBuilder("post")
                .innerJoinAndSelect("post.user", "user")
                .innerJoinAndSelect("post.tags", "tag")
                .where("post.userId = :userId", { userId: payload!.userId })
                .getMany();
        } catch (err) {
            console.log(err);
            return posts;
        }

        return posts
    }

    @Query(returns => [Post])
    @UseMiddleware(isAuth)
    async allPosts(): Promise<Post[]> {
        let posts: Post[];

        try {
            posts = await Post.createQueryBuilder("post")
                .innerJoinAndSelect("post.user", "user")
                .innerJoinAndSelect("post.tags", "tag")
                .where("post.private = false")
                .getMany();
        } catch (err) {
            console.log(err);
            return posts;
        }

        return posts;
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async createPost(@Arg("post") postInput: PostInput, @Ctx() { payload }: Context): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { id: payload!.userId } });
            const tags = await Tag.createQueryBuilder()
                .whereInIds(postInput.tags)
                .getMany();

            await Post.create({
                ...postInput, user, tags
            }).save();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(@Arg("postId") postId: string, @Ctx() { payload }: Context): Promise<boolean> {
        try {
            await Post.delete({ id: postId, });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}