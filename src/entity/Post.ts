import { PostType } from './../modules/post/types/PostType';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity("posts")
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", { length: 255 })
    title: string;

    @Column("text")
    description: string;

    @Column({ type: "enum", enum: PostType, default: PostType.Post })
    type: PostType;

    @Column("text")
    url: string;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;
}