import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    const post = await client.post.findUnique({
      where: {
        id: +id!,
      },
      include: {
        hashtag: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: true,
      },
    });

    if (!post) {
      return res.status(401).end();
    }
    res.json({ ok: true, post });
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
