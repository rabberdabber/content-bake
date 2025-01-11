import { useState } from "react";
import { JSONContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

import extensions from "@/features/editor/components/extensions";
import useLocalStorage from "./use-local-storage";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { handleCommandNavigation } from "@/features/editor/components/commands";
import { uploadImage } from "../image/utils";
import { toast } from "sonner";
import { validateSchema } from "@/lib/utils";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

const defaultContent: JSONContent = {
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

const apiContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Fibonacci Sequence in Python",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. It's a popular sequence in mathematics and computer science due to its simple definition and properties.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Here is a simple Python function to generate the Fibonacci sequence:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: "python",
      },
      content: {
        type: "text",
        text: "def fibonacci(n):\\n    sequence = []\\n    a, b = 0, 1\\n    while len(sequence) < n:\\n        sequence.append(a)\\n        a, b = b, a + b\\n    return sequence\\n\\n# Example usage: Get the first 10 Fibonacci numbers\\nprint(fibonacci(10))",
      },
    },
  ],
};

console.log(validateSchema(defaultContent, extensions));
console.log(validateSchema(apiContent, extensions));

const useBlockEditor = ({
  setEditorContent,
}: {
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [content, setContent] = useLocalStorage(
    "editor-content",
    JSON.stringify(apiContent)
  );
  const [image, setImage] = useState<string | File | null>(null);

  const onContentUpdate = (newContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
    setEditorContent?.(sanitizedContent);
  };
  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      if (ctx.editor.isEmpty) {
        ctx.editor.commands.setContent(apiContent);
        ctx.editor.commands.focus("start", { scrollIntoView: true });
      } else {
        ctx.editor.commands.setContent(content);
      }
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onContentUpdate(newContent);
      setContent(newContent);
    },
    extensions: [...extensions],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert",
      },
      handleDOMEvents: {
        keydown: (_view, event) => handleCommandNavigation(event),
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          event.preventDefault();
          const [file] = Array.from(event.dataTransfer.files);
          try {
            uploadImage(file).then((imageUrl) => setImage(imageUrl));
            toast.success("Image uploaded successfully");
          } catch (error) {
            toast.error("Failed to upload image");
          }

          return true;
        }
      },
    },
  });

  window.editor = editor;

  return { editor };
};

export default useBlockEditor;
