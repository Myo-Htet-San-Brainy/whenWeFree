import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if the current path is a protected route
  const isProtectedRoute = [
    "/Main/fillInData",
    "/Main/viewInfo",
    "/Main/profile",
    "/Main/createOrJoinATeam",
  ].some((path) => request.nextUrl.pathname === path);

  // For protected routes: redirect to sign-in if no token
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // For public routes: redirect to /Main/viewInfo if authenticated
  if (!isProtectedRoute && token) {
    return NextResponse.redirect(new URL("/Main/viewInfo", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except root, signUp, API routes, and static files
    "/((?!api|_next|public|signUp|.*\\.\\w+$|$).*)",
  ],
};
