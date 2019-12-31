import { User } from './../../../entity/User';
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {
    @Field(type => String)
    accessToken: string;

    @Field(type => User)
    user: User;
}