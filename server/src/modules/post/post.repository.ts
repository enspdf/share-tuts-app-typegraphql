import { Post } from './../../entity/Post';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> { }