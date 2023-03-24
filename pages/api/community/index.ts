import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { hashArr },
    } = req;

    if (!hashArr) {
      return;
    }
    const hash = hashArr
      .toString()
      .split(",")
      .map((hash) => ({
        hashtag: { name: hash },
      }));

    const posts = await client.post.findMany({
      where: {
        OR: [...hash],
      },

      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        hashtag: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
