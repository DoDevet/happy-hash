import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { comuId },
      session: { user },
    } = req;

    const scTag = await client.shortcutTag.findUnique({
      where: {
        id: +comuId!,
      },
      select: {
        hashtags: {
          select: {
            name: true,
          },
        },
        userId: true,
        customName: true,
        name: true,
        id: true,
      },
    });
    if (scTag?.userId !== user?.id) {
      return res.status(401).send("BadRequest");
    }

    const hashs = scTag?.hashtags.map((hash) => ({ hashtag: hash }));
    const posts = await client.post.findMany({
      where: {
        OR: hashs,
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
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      ok: true,
      posts,
      title: {
        customName: scTag?.customName,
        name: scTag?.name,
      },
      comuId: scTag?.id,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { image, payload, title, selectedHash },
    } = req;

    const post = await client.post.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        hashtag: {
          connect: {
            name: selectedHash,
          },
        },
        image: image,
        payload: payload,
        title: title,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      res.status(401).send("Bad Request");
    }
    res.json({ ok: true, postId: post.id });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["POST", "GET"] })
);
