"use client";

import dynamic from "next/dynamic";
import extensions from "@/features/editor/components/extensions";
import { generateHTML, JSONContent } from "@tiptap/react";

const demoContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { textAlign: "left", level: 1 },
      content: [
        {
          type: "text",
          text: "Building a CRUD API Using Django: A Step-by-Step Guide",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [{ type: "text", text: "Django, a high level" }],
    },
    {
      type: "heading",
      attrs: { textAlign: "left", level: 1 },
      content: [
        { type: "text", text: "Step 1: Setting Up the Django Project" },
      ],
    },
    { type: "paragraph", attrs: { textAlign: "left" } },
  ],
};

const EditorContainer = dynamic(
  () =>
    import("@/features/editor/components/editor-container").then(
      (mod) => mod.EditorContainer
    ),
  { ssr: false }
);

export default function Page() {
  return (
    <EditorContainer
      type="initial"
      initialContent={generateHTML(demoContent, extensions)}
    />
  );
}
