"use client";
import Sandbox from "@/components/code/live-code-block";

export default function Page() {
  return (
    <div suppressHydrationWarning className="mt-4">
      <Sandbox />
    </div>
  );
}
