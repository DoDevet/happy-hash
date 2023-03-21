import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, phone } = req.body;

    const user = phone ? { phone } : email ? { email } : null;
    if (user === null) return res.status(400).json({ ok: false });
    const payload = Math.floor(10000 + Math.random() * 10000) + "";
  }
}

export default withHandler({ handler, isPrivate: false, methods: ["POST"] });
