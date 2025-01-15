"use client";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import { motion, LayoutGroup } from "framer-motion";

interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ sidebar, children }: PageLayoutProps) {
  const { state } = useSidebar();

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid"
        style={{
          gridTemplateColumns:
            state === "expanded"
              ? "var(--sidebar-width) 1fr"
              : "var(--sidebar-width-icon) 1fr",
        }}
        transition={{
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <motion.div layout className="relative overflow-hidden">
          <motion.div
            animate={{
              opacity: state === "expanded" ? 1 : 0,
              width:
                state === "expanded"
                  ? "var(--sidebar-width)"
                  : "var(--sidebar-width-icon)",
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
