import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access the home page:
    if (req.nextUrl.pathname === "/" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to home and /posts
        const allowedPaths = ["/", "/auth/signup", "/auth/forgot-password"];
        if (
          allowedPaths.includes(req.nextUrl.pathname) ||
          req.nextUrl.pathname.startsWith("/posts")
        ) {
          return true;
        }
        // Require superuser for everything else
        return token?.is_superuser || false;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/posts",
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
