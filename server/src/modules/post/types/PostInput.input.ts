import { InputType, Field } from "type-graphql";
import { GenericPost } from "./GenericPost.input";

@InputType()
export class PostInput extends GenericPost {
    @Field(type => [String], { nullable: true })
    tags: string[];
}