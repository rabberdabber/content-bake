"use client";
import * as React from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Skeleton } from "./ui/skeleton";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";
import { useSession } from "next-auth/react";

export const navMainPrivate = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Icons.dashboard,
    items: [
      {
        title: "General",
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Posts",
    url: "/posts",
    icon: Icons.post,
    public: true,
    isActive: true,
    items: [
      {
        title: "Playground",
        url: "/edit",
        icon: Icons.create,
      },
      {
        title: "Explore All Posts",
        url: "/posts",
        public: true,
      },
      {
        title: "Published",
        url: "/published",
      },
      {
        title: "Drafts",
        url: "/drafts",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Icons.settings,
    disabled: true,
    items: [
      {
        title: "General",
        url: "#",
        disabled: true,
        reason: "Coming soon",
      },
    ],
  },
];

export const navMainPublic = [
  {
    title: "Explore Posts",
    icon: Icons.post,
    url: "/posts",
    public: true,
    items: [
      {
        title: "Posts",
        url: "/posts",
        public: true,
      },
    ],
  },
  {
    title: "Playground Demo",
    icon: Icons.play,
    url: "/demo",
    public: true,
    items: [
      {
        title: "Demo",
        url: "/demo",
        public: true,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mounted = useMounted();
  const { data: session } = useSession();

  if (!mounted)
    return <Skeleton className="w-[var(--sidebar-width)]"></Skeleton>;

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={cn(
        "border-r border-border z-50",
        "bg-background/80 backdrop-blur-sm backdrop-saturate-150 backdrop-filter",
        "duration-300 ease-in-out transition-all",
        props.className
      )}
    >
      <SidebarContent>
        <NavMain items={session ? navMainPrivate : navMainPublic} />
        <SidebarRail />
      </SidebarContent>
      <SidebarFooter className="border-t-2 border-border/50">
        <div className="flex items-center space-x-4 max-w-[var(--sidebar-width)] overflow-hidden">
          <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
