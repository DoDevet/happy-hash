import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { params },
    } = req;
    const hashs = await client.hashtag.findMany({
      where: {
        name: {
          startsWith: params?.toString(),
        },
      },
      include: {
        _count: {
          select: { posts: true, shortcutTag: true },
        },
      },
    });

    const posts = await client.post.findMany({
      where: {
        title: {
          startsWith: params?.toString(),
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        hashtag: {
          select: { name: true, id: true },
        },
        likes: {
          where: {
            userId: +user?.id!,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json({ hashs, posts });
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
