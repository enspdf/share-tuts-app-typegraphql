import { User } from './../entity/User';
import { Request, Response } from "express";
import { redis } from "../utils/Redis";
import { getConnection } from 'typeorm';
import { confirmUserPrefix } from "../modules/constants/RedisPrefixes";

export const confirmEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    const redisToken = `${confirmUserPrefix}${token}`;
    const userId = await redis.get(redisToken);

    if (userId) {
        await getConnection().createQueryBuilder()
            .update(User).set({ confirmed: true })
            .where("id = :userId", { userId })
            .execute();

        await redis.del(redisToken);

        res.send("User confirmed successfully");
    } else {
        res.send("Error, Invalid or Expired token");
    }
};