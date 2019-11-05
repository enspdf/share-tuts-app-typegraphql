import { PostType } from './PostType';
import { InputType, Field } from "type-graphql";

@InputType()
export class PostInput {
    @Field(type => String)
    title: string;

    @Field(type => String)
    description: string;

    @Field(type => String)
    type: PostType;

    @Field(type => String)
    url: string;
}