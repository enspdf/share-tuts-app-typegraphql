import { UserInput } from './types/UserInput.input';
import { User } from './../../entity/User';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "./user.repository";
import { LoginResponse } from './types/LoginResponse.response';
import { hash, compare } from "bcryptjs";
import { sendEmail } from '../utils/SendEmail';
import { createConfirmationUrl } from '../utils/CreateConfirmationUrl';
import { createAccessToken } from '../../utils/Auth';
import { redis } from "../../utils/Redis";
import { confirmUserPrefix } from '../constants/redisPrefixes';

@Service()
export class UserService {
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository
    ) { }

    async profile(userId: string): Promise<User | null> {
        try {
            return await this.userRepository
                .createQueryBuilder("user")
                .where("user.id = :userId", { userId })
                .getOne();
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async register(userInput: UserInput): Promise<Boolean> {
        const hashedPassword = await hash(userInput.password, 12);

        try {
            const user = await this.userRepository.save({
                ...userInput, password: hashedPassword
            });

            await sendEmail(userInput.email, await createConfirmationUrl(user.id));
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();

        if (!user) {
            throw new Error("Could not find user");
        }

        if (!user.confirmed) {
            throw new Error("The user must be confirmed");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("Invalid password");
        }

        return {
            accessToken: createAccessToken(user),
            user
        }
    }

    async confirmUser(token: string): Promise<Boolean> {
        const userId = await redis.get(`${confirmUserPrefix}${token}`);

        if (!userId) return false;

        await this.userRepository
            .createQueryBuilder()
            .update()
            .set({ confirmed: true })
            .where("id = :userId", { userId })
            .execute();

        await redis.del(token);

        return true;
    }
}