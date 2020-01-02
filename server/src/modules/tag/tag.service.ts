import { Tag } from './../../entity/Tag';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TagRepository } from "./tag.repository";

@Service()
export class TagService {
    constructor(
        @InjectRepository()
        private readonly tagRepository: TagRepository
    ) { }

    async getTags(): Promise<Tag[]> {
        return this.tagRepository
            .createQueryBuilder()
            .getMany();
    }

    async getTagById(tagId: string): Promise<Tag> {
        const tag: Tag = await this.tagRepository
            .createQueryBuilder("tag")
            .where("tag.id = :tagId", { tagId })
            .getOne();

        if (!tag) {
            throw new Error("Tag Not Found");
        }

        return tag;
    }

    async createTag(name: string): Promise<Boolean> {
        try {
            await this.tagRepository
                .createQueryBuilder()
                .insert()
                .into(Tag)
                .values({ name })
                .execute();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async updateTag(tagId: string, name: string): Promise<Boolean> {
        try {
            await this.tagRepository
                .createQueryBuilder()
                .update()
                .set({ name })
                .where("id = :tagId", { tagId })
                .execute();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async deleteTag(tagId: string): Promise<Boolean> {
        try {
            await this.tagRepository
                .createQueryBuilder()
                .delete()
                .from(Tag)
                .where("id = :tagId", { tagId })
                .execute();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}