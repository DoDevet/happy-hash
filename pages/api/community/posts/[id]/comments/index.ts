import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const post = await client.post.findUnique({
      where: {
        id: +id!,
      },
    });

    if (post) {
      const comments = await client.comment.findMany({
        where: {
          postId: +id!,
        },
        include: {
          user: true,
        },
      });
      return res.json({ ok: true, comments });
    } else return res.status(401).send("Photo not exitst");
  }
  if (req.method === "POST") {
    const {
      session: { user },
      query: { id },
      body: { message },
    } = req;

    const comments = await client.comment.create({
      data: {
        message: message,
        user: {
          connect: {
            id: +user?.id!,
          },
        },
        post: {
          connect: {
            id: +id!,
          },
        },
      },
    });
    if (comments) {
      res.json({ ok: true, comments });
    }
  }
  if (req.method === "DELETE") {
    const {
      session: { user },
      body: { commentsId },
    } = req;
    await client.comment.delete({
      where: {
        id: commentsId,
      },
    });
    res.json({ ok: true });
  }
  if (req.method === "PATCH") {
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["GET", "POST", "DELETE"] })
);
