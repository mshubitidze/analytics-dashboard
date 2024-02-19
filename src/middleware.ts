import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@/utils/analytics";

const pages = ["/", "/first-page", "/second-page"];

export default async function middleware(req: NextRequest) {
  if (pages.includes(req.nextUrl.pathname)) {
    try {
      analytics.track("pageview", {
        namespace: req.nextUrl.pathname,
        country: req.geo?.country,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return NextResponse.next();
}

export const matcher = {
  matcher: pages,
};
