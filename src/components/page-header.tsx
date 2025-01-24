"use client";

import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
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
import { Fragment, useMemo } from "react";

// Map of route segments to display names
const segmentNames: Record<string, string> = {
  posts: "Posts",
  dashboard: "Dashboard",
  settings: "Settings",
  profile: "Profile",
};

export default function PageHeader() {
  const mounted = useMounted();
  const segments = useSelectedLayoutSegments();
  const logicalSegments = useMemo(
    () =>
      segments
        .filter(
          (segment) => !(segment.startsWith("(") && segment.endsWith(")"))
        )
        .map((segment) => segmentNames[segment] || segment),
    [segments]
  );

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
          {logicalSegments.length > 0 && <BreadcrumbSeparator />}
          {logicalSegments.length > 0 &&
            logicalSegments.map((segment, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {index === segments.length - 1 ? (
                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                    >
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < segments.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
