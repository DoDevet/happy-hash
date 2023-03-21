import type { IronSessionOptions } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions: IronSessionOptions = {
  cookieName: "happysession",
  password: process.env.COOKIE_PW!,
};

export function withApiSession(
  fn: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(fn: () => Promise<any>) {
  return withIronSessionSsr(fn, cookieOptions);
}
