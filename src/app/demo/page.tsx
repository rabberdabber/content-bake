"use client";

import dynamic from "next/dynamic";
import { useBlockLocalEditor } from "@/lib/hooks/use-editor";
import { demoContent } from "@/config/demo";

const EditorRoot = dynamic(
  () =>
    import("@/features/editor/components/core/editor/editor-root").then(
      (mod) => mod.EditorRoot
    ),
  { ssr: false }
);

function Page() {
  const { editor, content, setContent } = useBlockLocalEditor({
    onUpdate: async (content) => {},
    storageKey: "demo-content",
    initialContent: demoContent,
  });
  return (
    <EditorRoot editor={editor} content={content} setContent={setContent} />
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
