"use client";

import { useSession } from "next-auth/react";
import { useSidebar } from "./ui/sidebar";
import { motion, LayoutGroup } from "framer-motion";
import { useMediaQuery, breakpoints } from "@/lib/hooks/use-media-query";

interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ sidebar, children }: PageLayoutProps) {
  const { state } = useSidebar();
  const { data: session } = useSession();
  const isMobile = !useMediaQuery(breakpoints.md);

  // Determine if sidebar should be shown and its state
  const showSidebar = Boolean(session) && !isMobile;
  const sidebarWidth = (() => {
    if (!showSidebar) return "0px";
    return state === "expanded"
      ? "var(--sidebar-width)"
      : "var(--sidebar-width-icon)";
  })();

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid"
        style={{
          gridTemplateColumns: showSidebar ? `${sidebarWidth} 1fr` : "1fr",
        }}
        transition={{
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <motion.div
          layout
          className="relative overflow-hidden"
          // Hide completely on mobile
          style={{ display: isMobile ? "none" : "block" }}
        >
          <motion.div
            animate={{
              opacity: showSidebar && state === "expanded" ? 1 : 0,
              width: sidebarWidth,
            }}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {sidebar}
          </motion.div>
        </motion.div>
        <motion.main layout className="min-h-full">
          {children}
        </motion.main>
      </motion.div>
    </LayoutGroup>
  );
}
