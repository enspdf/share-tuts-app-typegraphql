import { GenericPost } from './types/GenericPost.input';
import { TagRepository } from './../tag/tag.repository';
import { UserRepository } from './../user/user.repository';
import { Post } from './../../entity/Post';
import { Service } from "typedi";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostRepository } from "./post.repository";
import { PostInput } from './types/PostInput.input';

@Service()
export class PostService {
    constructor(
        @InjectRepository()
        private readonly postRepository: PostRepository,

        @InjectRepository()
        private readonly userRepository: UserRepository,

        @InjectRepository()
        private readonly tagRepository: TagRepository
    ) { }

    async myPosts(userId: string): Promise<Post[]> {
        let posts: Post[];

        try {
            posts = await this.postRepository
                .createQueryBuilder("post")
                .innerJoinAndSelect("post.user", "user")
                .leftJoinAndSelect("post.tags", "tags")
                .where("post.userId = :userId", { userId })
                .getMany();
        } catch (err) {
            console.log(err)
        } finally {
            return posts;
        }
    }

    async allPosts(): Promise<Post[]> {
        let posts: Post[];

        try {
            posts = await this.postRepository
                .createQueryBuilder("post")
                .innerJoinAndSelect("post.user", "user")
                .leftJoinAndSelect("post.tags", "tags")
                .where("post.private = false")
                .getMany();
        } catch (err) {
            console.log(err);
        } finally {
            return posts;
        }
    }

    async createPost(postInput: PostInput, userId: string): Promise<Boolean> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            const tags = await this.tagRepository
                .createQueryBuilder()
                .whereInIds(postInput.tags)
                .getMany();

            await this.postRepository.save({
                ...postInput,
                user,
                tags
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async updatePost(postId: string, postInput: GenericPost): Promise<Boolean> {
        try {
            await this.postRepository
                .createQueryBuilder()
                .update()
                .set({ ...postInput })
                .where("id = :postId", { postId })
                .execute();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async publishPost(postId: string): Promise<Boolean> {
        try {
            await this.postRepository
                .createQueryBuilder()
                .update()
                .set({ private: false })
                .where("id = :postId", { postId })
                .execute();
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    async deletePost(postId: string): Promise<Boolean> {
        try {
            await this.postRepository.delete({ id: postId });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}