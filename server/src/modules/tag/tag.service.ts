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
        return this.tagRepository.find();
    }

    async getTagById(tagId: string): Promise<Tag> {
        const tag: Tag = await this.tagRepository.findOne({ where: { id: tagId } });

        if (!tag) {
            throw new Error("Tag Not Found");
        }

        return tag;
    }

    async createTag(name: string): Promise<Tag> {
        return await this.tagRepository.save({ name });
    }

    async updateTag(tagId: string, name: string): Promise<Tag> {
        let tagToUpdate = await this.tagRepository.findOne({ where: { id: tagId } });

        return await this.tagRepository.save({ ...tagToUpdate, name });
    }

    async deleteTag(tagId: string): Promise<Boolean> {
        try {
            await this.tagRepository.delete({ id: tagId });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}