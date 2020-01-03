import { sendRefreshToken, createRefreshToken, createAccessToken } from './../utils/Auth';
import { User } from './../entity/User';
import { Request, Response } from 'express';
import { verify } from "jsonwebtoken";
import { getConnection } from 'typeorm';

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jid;

    if (!token) {
        return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;

    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET");
    } catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: "" });
    }


    const user = await getConnection().getRepository(User).findOne({ where: { id: payload.userId } });

    if (!user) {
        return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
};