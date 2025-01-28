import "@/app/globals.css";
import { Metadata, type Viewport } from "next";
import { Merriweather, Roboto, Inter as FontSans } from "next/font/google";

import { siteConfig } from "@/config/site";
import { CollectionsProvider } from "./collections-context";
import { SearchAndFilterSection } from "@/components/search-and-filter-section";
import { ResultsHeader } from "@/components/results-header";
import { PaginationControls } from "@/components/pagination-controls";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
