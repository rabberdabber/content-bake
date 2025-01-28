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
        <MainNav>
          <nav className="flex items-center ml-auto space-x-2">
            {session ? <NavUser /> : <></>}
          </nav>
        </MainNav>
      </div>
    </div>
  );
}
