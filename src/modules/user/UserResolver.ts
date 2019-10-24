import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";

@Resolver(of => User)
export class UserResolver {
    @Mutation(returns => Boolean)
    async createUser(@Arg("email") email: string, @Arg("password") password: string) {
        try {
            await User.insert({ email, password });
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }
}