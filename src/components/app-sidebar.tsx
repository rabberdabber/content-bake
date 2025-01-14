"use client";

import * as React from "react";

import { Icons } from "@/components/icons";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Bake",
    email: "bereketsiyum@gmail.com",
    avatar: "/profile.png",
  },
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
          title: "Create Post",
          url: "/edit",
          icon: Icons.create,
        },
        {
          title: "Published",
          url: "/posts",
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
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="fixed top-0 left-0 border-t border-border z-50 backdrop-blur-sm bg-background/80"
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarRail />
      </SidebarContent>
    </Sidebar>
  );
}
