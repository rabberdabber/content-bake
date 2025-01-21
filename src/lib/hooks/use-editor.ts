import { useState } from "react";
import { JSONContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

import extensions from "@/features/editor/components/extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { handleCommandNavigation } from "@/features/editor/components/commands";
import { uploadImage } from "../image/utils";
import { toast } from "sonner";

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
      content: [
        {
          type: "text",
          text: "def fibonacci(n):\\n    sequence = []\\n    a, b = 0, 1\\n    while len(sequence) < n:\\n        sequence.append(a)\\n        a, b = b, a + b\\n    return sequence\\n\\n# Example usage: Get the first 10 Fibonacci numbers\\nprint(fibonacci(10))",
        },
      ],
    },
  ],
};

type useBlockEditorParams =
  | {
      type: "initial";
      initialContent: string;
    }
  | {
      type: "local";
      storageKey: string;
    };

const useBlockEditor = (params: useBlockEditorParams) => {
  const [localContent, setLocalContent] = useLocalStorage(
    params.type === "local" ? params.storageKey : "editor-content",
    ""
  );
  const [editorContent, setEditorContent] = useState(
    params.type === "local" ? localContent : params.initialContent
  );
  const [droppedImage, setDroppedImage] = useState<string | File | null>(null);

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      if (params.type === "local") {
        console.log(
          "setting initial content from local storage ",
          localContent
        );
        ctx.editor.commands.setContent(localContent);
      } else {
        console.log(
          "setting initial content from params",
          params.initialContent
        );
        ctx.editor.commands.setContent(params.initialContent);
      }
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (params.type === "local") {
        const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
        console.log("updating local content", sanitizedContent);
        setLocalContent(sanitizedContent);
      }
      setEditorContent(newContent);
    },
    extensions: [...extensions],
    content: editorContent,
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
            uploadImage(crypto.randomUUID(), file).then((imageUrl) =>
              setDroppedImage(imageUrl)
            );
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

  const handleSetContent = (content: string) => {
    if (params.type === "local") {
      const sanitizedContent = DOMPurify.sanitize(content, sanitizeConfig);
      setLocalContent(sanitizedContent);
    }
    setEditorContent(content);
    editor?.commands.setContent(content);
  };

  return {
    editor,
    content: editorContent,
    setContent: handleSetContent,
  };
};

export default useBlockEditor;
