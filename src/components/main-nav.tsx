"use client";

import * as React from "react";
import PageHeader from "./page-header";

export function MainNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex gap-4 h-16 items-center">
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
