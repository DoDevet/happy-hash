import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { token },
    } = req;
    const ok = await client.token.findFirst({
      where: { token },
    });
    if (!ok) return res.status(404).end();
    else {
      req.session.user = {
        id: ok.userId,
      };
      await req.session.save();
      await client.token.deleteMany({
        where: {
          userId: ok.userId,
        },
      });
      res.json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["POST"], isPrivate: false })
);
