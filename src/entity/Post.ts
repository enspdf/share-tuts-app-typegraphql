import { PostType } from './../modules/post/types/PostType';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";
import { ObjectType, Field, ID } from 'type-graphql';

@Entity("posts")
@ObjectType()
export class Post extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field()
    @Column("varchar", { length: 255 })
    title: string;

    @Field()
    @Column("text")
    description: string;

    @Field()
    @Column({ type: "enum", enum: PostType, default: PostType.Post })
    type: PostType;

    @Field()
    @Column("text")
    url: string;

    @Field(type => User)
    @ManyToOne(() => User, user => user.posts)
    user: User;

    @Field(type => [Tag], { nullable: true })
    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];

    @Field(type => Boolean)
    @Column("boolean", { default: true })
    private: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;
}