import { DefaultSession } from "next-auth";
import type { User as ApiUser } from "./api";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      is_active: boolean;
      is_superuser: boolean;
      full_name: string;
      email_verified: boolean;
      image: string;
    } & DefaultSession["user"];
  }

  // The shape of the user object returned in the OAuth providers' profile callback,
  // or the second parameter of the session callback when using a database.
  interface User {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    email_verified: boolean;
    image: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
    email_verified: boolean;
    image: string;
  }
}
