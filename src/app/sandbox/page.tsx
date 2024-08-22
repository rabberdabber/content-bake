"use client";
import Sandbox from "@/components/live-code-block";

export default function Page() {
  return (
    <div suppressHydrationWarning className="mt-4">
      <Sandbox />
    </div>
  );
}
