import { InputType, Field } from "type-graphql";

@InputType()
export class UserInput {
    @Field(type => String)
    firstName: string;

    @Field(type => String)
    lastName: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string;
}