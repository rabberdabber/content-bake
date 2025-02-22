"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Breadcrumb } from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Fragment, useMemo } from "react";

export default function PageHeader() {
  const segments = useSelectedLayoutSegments();
  const logicalSegments = useMemo(
    () =>
      segments.filter(
        (segment) => !(segment.startsWith("(") && segment.endsWith(")"))
      ),
    [segments]
  );

  return (
    <div className="flex h-8 items-center gap-4">
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
                  {index === logicalSegments.length - 1 ? (
                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${logicalSegments.slice(0, index + 1).join("/")}`}
                    >
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < logicalSegments.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
