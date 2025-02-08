import "@/app/globals.css";
import { type Viewport } from "next";
import { Merriweather, Roboto, Inter as FontSans } from "next/font/google";

import { CollectionsProvider } from "./collections-context";
import { SearchAndFilterSection } from "@/components/search-and-filter-section";
import { ResultsHeader } from "@/components/results-header";
import { PaginationControls } from "@/components/pagination-controls";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface CollectionsLayoutProps {
  children: React.ReactNode;
}

export default function CollectionsLayout({
  children,
}: CollectionsLayoutProps) {
  return (
    <CollectionsProvider>
      <div className="space-y-6 px-4 py-6">
        <SearchAndFilterSection />
        <ResultsHeader />
        {children}
        <PaginationControls />
      </div>
    </CollectionsProvider>
  );
}
