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
            const user = await User.findOne({ where: { id: payload!.userId } });
            posts = await Post.find({ where: { user }, relations: ["tags"] });
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
            posts = await Post.find({ relations: ["tags", "user"] });
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
            // const tags = await Tag.findByIds(postInput.tags);
            const tags = await Tag.find({ id: In([postInput.tags]) });

            await Post.create({
                ...postInput, user, tags
            }).save();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}