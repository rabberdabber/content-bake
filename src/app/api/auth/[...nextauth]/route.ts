import NextAuth, { User, type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signin } from "@/lib/actions/user";
import { LoginResponse } from "@/types/api";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_API_URL}/login/access-token` +
      new URLSearchParams({
        grant_type: "refresh_token",
        token_data: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
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

          const response = (await signin({
            email: credentials.email,
            password: credentials.password,
          })) as LoginResponse;

          if (response.access_token) {
            // Get user profile using the access token
            // const userProfile = (await authApi.getUserProfile(
            //   response.access_token
            // )) as User;
            const userProfileResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
              {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              }
            );

            const userProfile = (await userProfileResponse.json()) as User;
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
      return user.is_active;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
        token.is_superuser = user.is_superuser;
        token.is_active = user.is_active;
        token.full_name = user.full_name;
        token.email_verified = user.email_verified;
        token.id = user.id;
        token.image = user.is_superuser ? "/profile.jpg" : "/avatar.png";
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.is_superuser = token.is_superuser;
        session.user.is_active = token.is_active;
        session.user.full_name = token.full_name;
        session.user.email_verified = token.email_verified;
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.image = token.is_superuser
          ? "/profile.jpg"
          : "/avatar.png";
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
