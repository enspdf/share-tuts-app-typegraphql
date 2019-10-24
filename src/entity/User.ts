import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from "typeorm";
import { Post } from "./Post";

import * as bcrypt from "bcryptjs";
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

    @Column("boolean", { default: false })
    confirmed: boolean;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    creationDate: Date;

    @Column("int", { default: 0 })
    tokenVersion: number;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
