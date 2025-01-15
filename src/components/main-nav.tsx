"use client";
import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSidebar } from "./ui/sidebar";
import { m } from "framer-motion";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  // const segment = useSelectedLayoutSegment() || "";
  // const { data: session } = useSession();
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        "flex gap-6 md:gap-10 w-screen ml-[--sidebar-width-icon]",
        open && "ml-[--sidebar-width]"
      )}
    >
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {/* {session && items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item) => {
            return (
              item.href && (
                <Link
                  key={item?.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-foreground/60 hover:text-foreground",
                    segment &&
                      (item.href.startsWith(`/${segment}`)
                        ? "text-foreground"
                        : "text-foreground/60"),
                    segment === "" && item.href === "/"
                      ? "text-foreground"
                      : "",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
            );
          })}
        </nav>
      ) : null} */}
    </div>
  );
}
