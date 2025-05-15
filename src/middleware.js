import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/";

  const sessionToken = request.cookies.get("__Secure-authjs.session-token")?.value || request.cookies.get("authjs.session-token")?.value;

  // if (isPublicPath && sessionToken) {
  //   return NextResponse.redirect(new URL("/profile", request.url));
  // }

  if (!isPublicPath && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/xplore", "/profile"],
};
