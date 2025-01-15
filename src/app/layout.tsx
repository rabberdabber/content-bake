import "@/app/globals.css";
import { Metadata, type Viewport } from "next";
import { Merriweather, Roboto, Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/session-provider";
import { SiteFooter } from "@/components/site-footer";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import PageHeader from "@/components/page-header";
import { PageLayout } from "@/components/page-layout";

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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          merriweather.variable,
          roboto.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <SidebarProvider>
              <div className="relative flex flex-col">
                <SiteHeader />
                <PageLayout sidebar={<DashboardSidebar />}>
                  <PageHeader />
                  {children}
                </PageLayout>
                <SiteFooter />
              </div>
            </SidebarProvider>
          </NextAuthProvider>
          <TailwindIndicator />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
