import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from "typeorm";
import { Post } from "./Post";

import { ObjectType, Field, ID } from "type-graphql";

@Entity("users")
@ObjectType()
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column("varchar")
    firstName: string;

    @Field()
    @Column("varchar")
    lastName: string;

    @Field()
    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("text")
    password: string;

    @Field(type => Boolean)
    @Column("boolean", { default: false })
    confirmed: boolean;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    creationDate: Date;

    @Column("int", { default: 0 })
    tokenVersion: number;
}
