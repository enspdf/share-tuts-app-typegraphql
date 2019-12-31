import { v4 } from "uuid";
import { redis } from "../../utils/Redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: string) => {
    const token = v4();
    await redis.set(`${confirmUserPrefix}${token}`, userId, "ex", 60 * 60 * 24);
    console.log("Confirmation token: ", `${confirmUserPrefix}${token}`, userId);

    return `http://localhost:3000/user/confirm/${token}`;
};