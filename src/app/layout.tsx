import "@/app/globals.css";
import { cookies } from "next/headers";
import { Metadata, type Viewport } from "next";
import { Merriweather, Roboto, Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/session-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    icon: "/logo.svg",
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
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
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="relative flex min-h-screen w-full group">
                <div className="sticky top-0 h-screen flex-shrink-0">
                  <AppSidebar />
                </div>
                <div className="flex flex-1 flex-col w-full ">
                  <SiteHeader />
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </NextAuthProvider>
          <TailwindIndicator />
          <Toaster />
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
