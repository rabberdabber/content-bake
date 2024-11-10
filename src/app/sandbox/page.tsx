"use client";
import Sandbox from "@/components/code/live-code-block";

export default function Page() {
  return (
    <div
      suppressHydrationWarning
      className="h-screen mt-4 grid place-content-center"
    >
      <Sandbox
        showConsole={false}
        showEditor={false}
        showFileExplorer={false}
        showPreview={true}
        showTitleBar={false}
        previewOnly
      />
    </div>
  );
}
