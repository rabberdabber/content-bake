"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {session && (
              <span className="text-sm text-muted-foreground mr-2">
                {session.user.full_name}
              </span>
            )}
            {session ? (
              <NavUser
                user={{
                  name: session.user.full_name,
                  email: session.user.email,
                  avatar: "/profile.png",
                }}
              />
            ) : (
              <></>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
