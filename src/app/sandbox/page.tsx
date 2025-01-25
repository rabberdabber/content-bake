"use client";
import Sandbox from "@/features/editor/components/core/code/live-code-block";

export default function SandboxPage() {
  return (
    <div className="container mx-auto max-w-[1000px] h-screen">
      <div className="h-full min-h-screen">Hello world</div>
      <Sandbox />
    </div>
  );
}
