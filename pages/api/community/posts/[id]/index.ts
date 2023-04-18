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

    const post = await client.post.update({
      where: { id: +id! },
      data: {
        views: { increment: 1 },
      },

      include: {
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
        likes: true,
        user: {
          select: {
            avatar: true,
            name: true,
            id: true,
          },
        },
      },
    });
    if (!post) {
      return res.json({ ok: false, error: "No post found" });
    }

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

    res.json({ ok: true, post, isFav, isMine: post.userId === user?.id });
  }
  if (req.method === "DELETE") {
    const {
      session: { user },
      query: { id },
    } = req;
    const post = await client.post.findFirst({
      where: { AND: [{ id: +id! }, { userId: +user?.id! }] },
      select: {
        image: true,
      },
    });
    if (post) {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${post?.image}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        }
      );
      await client.post.delete({
        where: {
          id: +id!,
        },
      });
      return res.json({ ok: true });
    } else return res.json({ ok: false, error: "Validation Error" });
  }
  if (req.method === "PATCH") {
    const {
      session: { user },
      body: { imageURL, payload, title, selectedHash },
      query: { id },
    } = req;

    const prevPostData = await client.post.findUnique({
      where: { id: +id! },
    });
    if (prevPostData && prevPostData.userId !== +user?.id!) {
      return res.json({ ok: false, error: "InValidate" });
    }
    if (!imageURL) {
      await client.post.update({
        where: {
          id: +id!,
        },
        data: {
          payload,
          title,
          hashtag: { connect: { name: selectedHash } },
        },
      });
    } else {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${prevPostData?.image}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        }
      );
      await client.post.update({
        where: {
          id: +id!,
        },
        data: {
          payload,
          title,
          hashtag: { connect: { name: selectedHash } },
          image: imageURL,
        },
      });
    }
    res.json({ ok: true, postId: +id! });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["GET", "POST", "DELETE", "PATCH"] })
);
