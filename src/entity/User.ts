import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from "typeorm";
import { Post } from "./Post";

import * as bcrypt from "bcryptjs";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    firstName: string;

    @Column("varchar")
    lastName: string;

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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
