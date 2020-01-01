import { PostTypeEnum } from '../modules/post/types/PostTypeEnum.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";
import { ObjectType, Field, ID } from 'type-graphql';

@Entity("posts")
@ObjectType()
export class Post {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field(type => String)
    @Column("varchar", { length: 255 })
    title: string;

    @Field(type => String)
    @Column("text")
    description: string;

    @Field(type => String)
    @Column({ type: "enum", enum: PostTypeEnum, default: PostTypeEnum.Post })
    type: PostTypeEnum;

    @Field(type => String)
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

    @Field(type => String)
    @CreateDateColumn({ readonly: true })
    createdAt: String;

    @Field(type => String)
    @UpdateDateColumn({ readonly: true })
    updatedAt: String;
}