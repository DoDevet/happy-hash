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
            },
          },
        },
      });
      if (!scHash || user?.id !== scHash?.userId) {
        res.status(401).send("BAD REQUEST");
      }
      const hashArr = scHash?.hashtags.map((hash) => hash.name);
      res.json({ ok: true, hashArr });
    } else if (hashId) {
      const hashArr = await client.hashtag.findUnique({
        where: { id: +hashId! },
        select: { name: true },
      });
      if (!hashArr) {
        res.status(401).send("BAD REQUEST");
      }
      res.json({ ok: true, hashArr: [hashArr?.name] });
    }
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
