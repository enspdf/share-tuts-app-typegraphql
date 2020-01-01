import { Tag } from "./../../entity/Tag";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> { }