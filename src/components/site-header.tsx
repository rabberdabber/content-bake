"use client";

import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { NavUser } from "./nav-user";
1;

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 left-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center space-x-4">
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
    </div>
  );
}
