import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import moment from "moment";
import { withApiSession } from "@/libs/server/withSession";
import getDateTimeFormat from "@/libs/server/getDateTimeFormat";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const oneHour = moment().subtract(2, "hours").toDate();

    const ratingHashs = await client.hashtag.findMany({
      select: {
        name: true,
        id: true,
        _count: {
          select: {
            posts: true,
          },
        },
        posts: {
          select: { id: true },
          where: {
            createdAt: {
              gte: oneHour,
            },
          },
        },
      },
      take: 10,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });

    const sortHashs = ratingHashs.sort((a, b) => {
      return b.posts.length - a.posts.length;
    });
    res.json({ ok: sortHashs.length !== 0, hashRanking: sortHashs });
  }
}

export default withApiSession(withHandler({ handler, methods: ["GET"] }));
