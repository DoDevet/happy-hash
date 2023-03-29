import { getIronSession } from "iron-session/edge";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  if (!req.nextUrl.pathname.startsWith("/login")) {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
      cookieName: "happysession",
      password: process.env.COOKIE_PW!,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    });
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/login")) {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
      cookieName: "happysession",
      password: process.env.COOKIE_PW!,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    });
    if (session?.user?.id) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
};
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
