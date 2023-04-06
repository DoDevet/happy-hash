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
      include: {
        hashtags: {
          select: { id: true, name: true },
        },
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
  if (req.method === "PATCH") {
    const {
      body: { id, hashs, shName },
    } = req;
    const connectHash = hashs.map((name: string) => {
      return { where: { name: name }, create: { name: name } };
    });

    const prevHash = await client.shortcutTag.findUnique({
      where: {
        id: id,
      },
      select: {
        hashtags: {
          select: {
            id: true,
          },
        },
      },
    });
    const disconnectHash = prevHash?.hashtags?.map((hash) => ({ id: hash.id }));
    await client.shortcutTag.update({
      where: {
        id: id,
      },
      data: {
        customName: shName,
        hashtags: {
          disconnect: [...disconnectHash!],
          connectOrCreate: [...connectHash],
        },
        name: hashs.toString(),
      },
    });
    res.json({ ok: true });
  }
  if (req.method === "DELETE") {
    const {
      session: { user },
      body: { id },
    } = req;

    const deleteValidate = await client.shortcutTag.findFirst({
      where: {
        AND: [{ id: id }, { user: { id: +user?.id! } }],
      },
      select: {
        hashtags: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!Boolean(deleteValidate))
      return res.json({ ok: false, error: "Validate failed" });
    const disconnectHash = deleteValidate?.hashtags?.map((hash) => ({
      id: hash.id,
    }));
    await client.shortcutTag.update({
      where: {
        id: id,
      },
      data: {
        hashtags: {
          disconnect: [...disconnectHash!],
        },
      },
    });

    await client.shortcutTag.delete({
      where: { id },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["DELETE", "GET", "POST", "PATCH"] })
);
