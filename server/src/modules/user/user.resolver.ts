import { Context } from './../../utils/Context';
import { isAuth } from './../../middleware/IsAuthMiddleware';
import { User } from './../../entity/User';
import { Service } from "typedi";
import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg } from "type-graphql";
import { UserService } from './user.service';
import { UserInput } from './types/UserInput.input';
import { LoginResponse } from './types/LoginResponse.response';

@Service()
@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => User, { nullable: true })
    @UseMiddleware(isAuth)
    async profile(@Ctx() { payload }: Context): Promise<User | null> {
        return this.userService.profile(payload!.userId);
    }

    @Mutation(returns => Boolean)
    async register(@Arg("input") userInput: UserInput): Promise<Boolean> {
        return this.userService.register(userInput);
    }

    @Mutation(returns =>Boolean)
    async revokeRefreshTokenForUser(@Arg("userId") userId: string):Promise<Boolean>{
        return this.userService.revokeRefreshTokenForUser(userId);
    }

    @Mutation(returns => LoginResponse)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { res }: Context): Promise<LoginResponse> {
        return this.userService.login(email, password, res);
    }

    @Mutation(returns => Boolean)
    async logout(@Ctx() { res }: Context): Promise<Boolean> {
        return this.userService.logout(res);
    }

    @Mutation(returns => Boolean)
    async confirmUser(@Arg("token") token: string): Promise<Boolean> {
        return this.userService.confirmUser(token);
    }
}