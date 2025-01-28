"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="pl-[var(--sidebar-width)] grid place-items-center w-full border-t bg-background">
      <div className="container flex h-14 items-center justify-center gap-4 px-4">
        <p className="text-sm font-medium">
          Content Bake<span className="ml-1">&reg;</span>
        </p>
        <div className="flex items-center space-x-2">
          <Link
            href={siteConfig.links.portfolio}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Icons.globe className="h-5 w-5" />
              <span className="sr-only">Check out my website</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
