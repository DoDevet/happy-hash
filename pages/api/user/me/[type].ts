import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { kind, page },
    session: { user },
  } = req;
  if (req.method) {
    if (kind === "favs") {
      const posts = await client.post.findMany({
        where: {
          likes: {
            some: {
              userId: +user?.id!,
            },
          },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          views: true,
          payload: true,
          image: true,
          likesNum: true,
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
              id: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: {
            where: {
              userId: +user?.id!,
            },
          },
        },
        take: 20,
        skip: page ? (+page - 1) * 20 : 0,
      });
      return res.json({ ok: true, posts });
    }
    if (kind === "posts") {
      const posts = await client.post.findMany({
        where: {
          userId: +user?.id!,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          views: true,
          payload: true,
          image: true,
          likesNum: true,
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
              id: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: {
            where: {
              userId: +user?.id!,
            },
          },
        },
        take: 20,
        skip: page ? (+page - 1) * 20 : 0,
      });
      return res.json({ ok: true, posts });
    }
    if (kind === "comments") {
      const comments = await client.comment.findMany({
        where: { userId: +user?.id! },
      });
      return res.json({ ok: true, comments });
    }
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
