"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Breadcrumb } from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Skeleton } from "./ui/skeleton";

// Map of route segments to display names
const segmentNames: Record<string, string> = {
  posts: "Posts",
  dashboard: "Dashboard",
  settings: "Settings",
  profile: "Profile",
};

export default function PageHeader() {
  const mounted = useMounted();
  const segment = useSelectedLayoutSegment();

  if (!mounted) {
    return (
      <Skeleton className="h-8 w-full mt-2 bg-muted/50 backdrop-blur-sm" />
    );
  }

  return (
    <div className="sticky top-0 flex h-8 mt-2 items-center gap-4 px-4">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {segment && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {segmentNames[segment] || segment}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
