"use client";

import dynamic from "next/dynamic";

const EditorContainer = dynamic(
  () =>
    import("@/features/editor/components/editor-container").then(
      (mod) => mod.EditorContainer
    ),
  { ssr: false }
);

export default function Page() {
  return (
    <EditorContainer type="local" storageKey="editor-content" isDraft={false} />
  );
}
