import { InputType, Field } from "type-graphql";
import { PostTypeEnum } from "./PostTypeEnum.enum";

@InputType()
export class GenericPost {
    @Field(type => String)
    title: string;

    @Field(type => String)
    description: string;

    @Field(type => String)
    type: PostTypeEnum;

    @Field(type => String)
    url: string;
}