import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { email, phone },
    } = req;
    const user = phone ? { phone } : email ? { email } : null;
    if (user === null) return res.status(400).json({ ok: false });
    const payload = Math.floor(10000 + Math.random() * 10000) + "";
    const token = await client.token.create({
      data: {
        token: payload,
        user: {
          connectOrCreate: {
            where: {
              ...user,
            },
            create: {
              name: "Anonymos",
              ...user,
            },
          },
        },
      },
    });

    return res.json({ ok: true });
  }
}

export default withHandler({ handler, isPrivate: false, methods: ["POST"] });
