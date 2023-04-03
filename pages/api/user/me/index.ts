import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const profile = await client.user.findUnique({
      where: {
        id: +user?.id!,
      },
      include: {
        _count: {
          select: {
            comments: true,
            posts: true,
          },
        },
      },
    });

    if (profile) {
      return res.json({ ok: true, profile });
    } else {
      return res.status(401).send("Bad Request");
    }
  }
  if (req.method === "PATCH") {
    const {
      session: { user },
      body: { email, name, phone, avatarID },
    } = req;

    const prevUserInfo = await client.user.findUnique({
      where: {
        id: +user?.id!,
      },
    });

    if (email && prevUserInfo && prevUserInfo.email !== email) {
      const existsEmail = Boolean(
        await client.user.findFirst({
          where: {
            email,
          },
        })
      );
      if (existsEmail) {
        return res.json({ ok: false, error: "This email is already in use." });
      } else {
        await client.user.update({
          where: {
            id: +user?.id!,
          },
          data: {
            email,
          },
        });
      }
    }

    if (phone && phone !== prevUserInfo?.phone) {
      const existsPhone = Boolean(
        await client.user.findFirst({
          where: {
            phone,
          },
        })
      );
      if (existsPhone) {
        return res.json({
          ok: false,
          error: "This phone number is already in use.",
        });
      } else {
        await client.user.update({
          where: {
            id: +user?.id!,
          },
          data: {
            phone: phone,
          },
        });
      }
    }

    if (avatarID && avatarID !== prevUserInfo?.avatar) {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${prevUserInfo?.avatar}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        }
      );
      await client.user.update({
        where: {
          id: +user?.id!,
        },
        data: {
          avatar: avatarID,
        },
      });
    }
    if (name && name !== prevUserInfo?.name) {
      await client.user.update({
        where: {
          id: +user?.id!,
        },
        data: {
          name,
        },
      });
    }

    return res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["GET", "PATCH"] })
);
