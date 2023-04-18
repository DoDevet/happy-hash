import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { comuId, hashId, page, selectHash, popular },
      session: { user },
    } = req;
    console.log(page);
    if (comuId) {
      const scTag = await client.shortcutTag.findFirst({
        where: { AND: [{ id: +comuId! }, { user: { id: +user?.id! } }] },
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
      if (scTag === undefined || scTag?.userId !== user?.id) {
        return res.status(401).json({ ok: false });
      } else {
        const posts = await client.post.findMany({
          where: {
            OR: selectHash
              ? [{ hashtag: { name: selectHash.toString() } }]
              : scTag?.hashtags.map((hash) => ({
                  hashtag: hash,
                })),
            likesNum: {
              gte: popular ? +popular : 0,
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
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
          skip: page ? (+page - 1) * 20 : 0,
        });
        res.json({
          ok: true,
          posts,
        });
      }
    } else if (hashId) {
      const hashInfo = await client.hashtag.findUnique({
        where: { id: +hashId! },
      });
      if (!hashInfo) {
        return res.json({ ok: false });
      }
      const posts = await client.post.findMany({
        where: {
          hashtagId: +hashId!,
          likesNum: {
            gte: popular ? +popular : 0,
          },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          views: true,
          payload: true,
          image: true,
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
          likes: {
            where: {
              userId: +user?.id!,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        skip: page ? (+page - 1) * 20 : 0,
      });
      res.json({
        ok: true,
        posts,
      });
    } else res.json({ ok: false, error: "Error" });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { imageURL, payload, title, selectedHash },
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
        image: imageURL,
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
  if (req.method === "PATCH") {
    const {
      session: { user },
      body: { imageURL, payload, title, selectedHash, postId },
    } = req;
    const prevPostData = await client.post.findUnique({
      where: { id: +postId! },
    });
    if (prevPostData && prevPostData.userId !== +user?.id!) {
      return res.json({ ok: false, error: "InValidate" });
    }
    if (!imageURL) {
      await client.post.update({
        where: {
          id: +postId!,
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
          id: +postId!,
        },
        data: {
          payload,
          title,
          hashtag: { connect: { name: selectedHash } },
          image: imageURL,
        },
      });
    }
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["POST", "GET", "PATCH"] })
);
