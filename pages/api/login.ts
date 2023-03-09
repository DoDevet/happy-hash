import { NextApiRequest, NextApiResponse } from "next";

export default function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") console.log(req.body);
}
