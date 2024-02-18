import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@/utils/analytics";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    try {
      analytics.track("pageview", {
        namespace: "/",
        country: req.geo?.country,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return NextResponse.next();
}

export const matcher = {
  matcher: ["/"],
};
