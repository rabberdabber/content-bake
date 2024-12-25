"use client";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

const NextAuthProvider = ({ children, session }: SessionProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;
