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

const data = {
  navMain: [
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
      isActive: true,
      items: [
        {
          title: "All Posts",
          url: "/posts",
          public: true,
        },
        {
          title: "Create Post",
          url: "/edit",
          icon: Icons.create,
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mounted = useMounted();

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
        <NavMain items={data.navMain} />
        <SidebarRail />
      </SidebarContent>
      <SidebarFooter className="border-t-2 border-border/50">
        <div className="flex items-center space-x-4">
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
                <span className="sr-only">Portfolio</span>
              </div>
            </Link>
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
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
