import { User } from './../../entity/User';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> { }