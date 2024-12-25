"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import IconButton from "./ui/icon-button";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {session && (
              <span className="text-sm text-muted-foreground mr-2">
                {session.user.full_name}
              </span>
            )}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </div>
            </Link>
            <ThemeToggle />
            {session ? (
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <Icons.logout className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </div>
            ) : (
              <> </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
