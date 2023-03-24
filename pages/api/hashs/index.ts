import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const tags = await client.shortcutTag.findMany({
      where: {
        userId: user?.id,
      },
    });

    res.json({
      ok: true,
      tags,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { hashs, shName },
    } = req;

    const connectHash = hashs.map((name: string) => {
      return { where: { name: name }, create: { name: name } };
    });

    const tags = await client.shortcutTag.create({
      data: {
        customName: shName ? shName : "",
        name: hashs.toString(),
        user: {
          connect: {
            id: user?.id,
          },
        },
        hashtags: {
          connectOrCreate: [...connectHash],
        },
      },
    });

    res.json({
      ok: true,
      tags,
    });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["DELETE", "GET", "POST"] })
);
