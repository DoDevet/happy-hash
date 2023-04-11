import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { comuId, hashId },
    } = req;
    if (comuId) {
      const scHash = await client.shortcutTag.findFirst({
        where: { AND: [{ id: +comuId! }, { userId: +user?.id! }] },
        select: {
          userId: true,
          hashtags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      if (!scHash || user?.id !== scHash?.userId) {
        return res.status(401).send("BAD REQUEST");
      }
      return res.json({ ok: true, hashArr: scHash.hashtags });
    } else if (hashId) {
      const hashArr = await client.hashtag.findUnique({
        where: { id: hashId ? +hashId : undefined },
        select: { name: true, id: true },
      });
      if (!hashArr) {
        return res.status(401).send("BAD REQUEST");
      }
      return res.json({
        ok: true,
        hashArr: [{ name: hashArr.name, id: hashArr.id }],
      });
    }
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
