import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { User } from "./types/api";

// Public routes that don't require authentication
const PUBLIC_ROUTES = {
  HOME: "/",
  POSTS: "/posts",
  AUTH: "/auth/signin",
  SYSTEM: {
    API: "/api",
    NEXT_STATIC: "/_next/static",
    NEXT_IMAGE: "/_next/image",
    FAVICON: "/favicon.ico",
    PUBLIC: "/public",
  },
};

// Protected routes that require specific conditions
const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  VERIFY_EMAIL: "/auth/verify-email",
  PUBLISHED: "/published",
  DRAFTS: "/drafts",
} as const;

const needsEmailVerification = (pathname: string, token: any): boolean => {
  return (
    token &&
    !token.email_verified &&
    !token.is_superuser &&
    ![PROTECTED_ROUTES.VERIFY_EMAIL, PUBLIC_ROUTES.HOME].includes(pathname) &&
    !pathname.startsWith(PUBLIC_ROUTES.POSTS)
  );
};

const hasVerifiedEmail = (token: any): boolean => {
  return token && (token.email_verified || token.is_superuser);
};

const getVerifyEmailToken = (url: URL): string | null => {
  return url.searchParams.get("token");
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (!token && pathname === PUBLIC_ROUTES.HOME) {
      return NextResponse.next();
    }

    // Check for email verification token in query params
    if (pathname === "/verify") {
      const verifyToken = getVerifyEmailToken(req.nextUrl);
      if (verifyToken) {
        try {
          // Attempt to verify email with token
          const verifyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/verify-email?token=${verifyToken}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (verifyResponse.ok) {
            // Redirect to login with success message
            return NextResponse.redirect(new URL("/dashboard", req.url));
          } else {
            // Redirect to login with error message
            return NextResponse.redirect(new URL("/auth/signin", req.url));
          }
        } catch (error) {
          return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
      }
    }

    // Redirect authenticated users from home to dashboard
    if ([PUBLIC_ROUTES.AUTH, PUBLIC_ROUTES.HOME].includes(pathname) && token) {
      return NextResponse.redirect(
        new URL(PROTECTED_ROUTES.DASHBOARD, req.url)
      );
    }

    // Redirect verified users away from verification page
    if (pathname === PROTECTED_ROUTES.VERIFY_EMAIL && hasVerifiedEmail(token)) {
      return NextResponse.redirect(
        new URL(PROTECTED_ROUTES.DASHBOARD, req.url)
      );
    }

    // Redirect users with unverified email to verification page
    if (needsEmailVerification(pathname, token)) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${req.nextauth.token?.accessToken}`,
          },
        }
      );
      const data = (await response.json()) as User;
      if (!data.email_verified) {
        return NextResponse.redirect(
          new URL(PROTECTED_ROUTES.VERIFY_EMAIL, req.url)
        );
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    // Protected routes that require auth
    "/dashboard/:path*",
    "/edit/:path*",
    "/settings/:path*",
    "/auth/verify-email",
    "/published/:path*",
    "/drafts/:path*",
    // Include verify route for email verification
    "/verify",
    // Exclude all public routes including home path
    "/((?!posts|auth/signup|api|_next/static|_next/image|favicon.ico|public|demo|$).*)",
  ],
};
