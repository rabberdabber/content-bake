"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 left-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4">
        <MainNav>
          <nav className="flex items-center ml-auto space-x-2">
            {session ? (
              <NavUser />
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/demo">Try Demo</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/api/auth/signin">Login</Link>
                </Button>
              </>
            )}
          </nav>
        </MainNav>
      </div>
    </div>
  );
}
