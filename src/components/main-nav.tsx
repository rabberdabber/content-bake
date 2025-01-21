"use client";

import * as React from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function MainNav() {
  return (
    <div className="flex items-center justify-between w-full mr-6">
      <div className="flex items-center gap-6 md:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4 border border-border/10">
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
