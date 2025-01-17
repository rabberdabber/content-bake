"use client";

import PageHeader from "./page-header";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageHeader />
      {children}
    </>
  );
}
