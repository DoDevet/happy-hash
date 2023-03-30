import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { postId },
    } = req;

    const isLiked = await client.like.findFirst({
      where: {
        user: {
          id: +user?.id!,
        },
        post: {
          id: +postId!,
        },
      },
    });

    if (isLiked) {
      const disconnectedLike = await client.like.delete({
        where: {
          id: +isLiked?.id!,
        },
      });
      return res.json({ ok: true });
    } else {
      const connectLike = await client.like.create({
        data: {
          post: {
            connect: {
              id: +postId!,
            },
          },
          user: {
            connect: {
              id: +user?.id!,
            },
          },
        },
      });
      return res.json({ ok: true });
    }
  }
}

export default withApiSession(withHandler({ handler, methods: ["POST"] }));
