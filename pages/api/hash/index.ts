import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { hashs },
    } = req;
    console.log(hashs, user);
  }
}

export default withApiSession(
  withHandler({ handler, methods: ["DELETE", "GET", "POST"] })
);
