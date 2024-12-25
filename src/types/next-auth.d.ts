import { DefaultSession } from "next-auth";
import type { User as ApiUser } from "./api";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      email: string;
      is_active: boolean;
      is_superuser: boolean;
      full_name: string;
    } & DefaultSession["user"];
  }

  // The shape of the user object returned in the OAuth providers' profile callback,
  // or the second parameter of the session callback when using a database.
  interface User {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
  }
}
