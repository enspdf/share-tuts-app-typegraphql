import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity("tags")
@ObjectType()
export class Tag {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(type => String)
    @Column("varchar", { length: 255 })
    name: string;

    @Field(type => String)
    @CreateDateColumn({ readonly: true })
    createdAt: String;

    @Field(type => String)
    @UpdateDateColumn({ readonly: true })
    updatedAt: String;
}