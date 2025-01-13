import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/lib/api";
import type { User, LoginResponse } from "@/types/api";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "bereketsiyum@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = (await authApi.login({
            email: credentials.email,
            password: credentials.password,
          })) as LoginResponse;

          if (response.access_token) {
            // Get user profile using the access token
            const userProfile = (await authApi.getUserProfile(
              response.access_token
            )) as User;

            return {
              ...userProfile,
              accessToken: response.access_token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow active superusers to sign in
      return user.is_active && user.is_superuser;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
        token.is_superuser = user.is_superuser;
        token.is_active = user.is_active;
        token.full_name = user.full_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.is_superuser = token.is_superuser;
        session.user.is_active = token.is_active;
        session.user.full_name = token.full_name;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
