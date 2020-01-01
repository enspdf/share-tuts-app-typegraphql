import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Post } from "./Post";

import { ObjectType, Field, ID } from "type-graphql";

@Entity("users")
@ObjectType()
export class User {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(type => String)
    @Column("varchar")
    firstName: string;

    @Field(type => String)
    @Column("varchar")
    lastName: string;

    @Field(type => String)
    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("text")
    password: string;

    @Field(type => Boolean)
    @Column("boolean", { default: false })
    confirmed: boolean;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @CreateDateColumn({ readonly: true })
    createdAt: String;

    @UpdateDateColumn({ readonly: true })
    updatedAt: String;

    @Column("int", { default: 0 })
    tokenVersion: number;
}
