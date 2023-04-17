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
    const findPost = await client.post.findFirst({
      where: {
        id: +postId!,
      },
      select: {
        id: true,
        likes: {
          select: {
            id: true,
          },
          where: {
            userId: +user?.id!,
          },
        },
      },
    });
    const toggleFav = findPost?.likes.length === 0;
    if (findPost) {
      if (!toggleFav) {
        await client.like.delete({
          where: {
            id: +findPost.likes[0].id!,
          },
          select: {
            post: { select: { _count: { select: { likes: true } } } },
          },
        });
        await client.post.update({
          where: { id: +findPost.id },
          data: { likesNum: { decrement: 1 } },
        });
      } else {
        await client.like.create({
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
          select: {
            post: { select: { _count: { select: { likes: true } } } },
          },
        });
        await client.post.update({
          where: { id: +findPost.id },
          data: { likesNum: { increment: 1 } },
        });
      }
      return res.json({ ok: true });
    } else return res.json({ ok: false });
  }
}

export default withApiSession(withHandler({ handler, methods: ["POST"] }));
