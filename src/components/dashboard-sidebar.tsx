"use client";
import { AppSidebar } from "@/components/app-sidebar";

import { useSession } from "next-auth/react";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  return <>{session && <AppSidebar />}</>;
}
