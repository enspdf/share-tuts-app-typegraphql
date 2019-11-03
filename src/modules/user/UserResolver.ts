import { createAccessToken } from './../../utils/Auth';
import { Context } from './../../utils/Context';
import { LoginResponse } from './types/LoginResponse';
import { UserInput } from './types/UserInput';
import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { hash, compare } from "bcryptjs";

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
    async register(@Arg("user") userInput: UserInput): Promise<boolean> {
        const hashedPassword = await hash(userInput.password, 12);

        try {
            await User.insert({
                ...userInput, password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    @Mutation(returns => LoginResponse)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { res }: Context): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        /*if (!user.confirmed) {
            throw new Error("The user must be confirmed");
        }*/

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("Invalid password");
        }

        return {
            accessToken: createAccessToken(user),
            user
        }
    }
}