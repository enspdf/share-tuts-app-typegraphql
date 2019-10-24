import { UserInput } from './types/UserInput';
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "../../entity/User";

@Resolver(of => User)
export class UserResolver {
    @Query(returns => [User])
    async getUsers(): Promise<User[]> {
        return await User.find();
    }

    @Query(returns => User)
    async getUserById(@Arg("userId") userId: string): Promise<User> {
        const user: User = await User.findOne({ where: { id: userId } })

        if (!user) {
            throw new Error("User Not Found");
        }

        return user;
    }

    @Mutation(returns => Boolean)
    async createUser(@Arg("user") userInput: UserInput): Promise<boolean> {
        try {
            await User.create({ ...userInput, password: userInput.password }).save();
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }
}