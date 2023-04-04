import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
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
        likes: true,
        user: true,
      },
    });

    const isFav = Boolean(
      await client.like.findFirst({
        where: {
          user: {
            id: +user?.id!,
          },
          postId: +id!,
        },
      })
    );

    if (!post) {
      return res.json({ ok: false, error: "No post found" });
    }
    res.json({ ok: true, post, isFav });
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
