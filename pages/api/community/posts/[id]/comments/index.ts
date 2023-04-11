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
          user: {
            select: { avatar: true, id: true, name: true },
          },
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
    const {
      session: { user },
      body: { message, commentsId },
    } = req;

    const comments = Boolean(
      await client.comment.findFirst({
        where: {
          userId: +user?.id!,
          id: commentsId,
        },
      })
    );

    if (comments) {
      await client.comment.update({
        where: {
          id: commentsId,
        },
        data: {
          message,
        },
      });
      return res.json({ ok: true });
    } else return res.json({ ok: false, erorr: "Invalid" });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["GET", "POST", "DELETE", "PATCH"] })
);
