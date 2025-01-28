"use client";

import * as React from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import PageHeader from "./page-header";

export function MainNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center">
          <div className="mr-8 flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-colors hover:text-foreground/80"
            >
              <Icons.logo className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="flex-1">
            <PageHeader />
          </div>

          <div className="flex items-center justify-end space-x-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
