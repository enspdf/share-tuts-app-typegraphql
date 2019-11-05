import { User } from './../../entity/User';
import { Context } from './../../utils/Context';
import { PostInput } from './types/PostInput';
import { isAuth } from './../../middleware/IsAuthMiddleware';
import { Post } from './../../entity/Post';
import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from "type-graphql";

@Resolver(of => Post)
export class PostResolver {
    @Mutation(returns => Boolean)
    @UseMiddleware(isAuth)
    async createPost(@Arg("post") postInput: PostInput, @Ctx() { payload }: Context): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { id: payload!.userId } });

            await Post.insert({
                ...postInput, user
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}