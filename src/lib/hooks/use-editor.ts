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
import { validateSchema } from "../utils";
import json5 from "json5";

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
          text: "Understanding Python Decorators",
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
          text: "Decorators are a powerful and useful tool in Python, enabling developers to modify the behavior of a function or class method. They are often used to implement cross-cutting concerns such as logging, timing, and access control.",
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
          text: "A decorator is a function that takes another function as an argument and returns a new function that adds some kind of functionality. Python provides a simple syntax for these, using the '@' symbol. Let's explore an example of how to create and use decorators.",
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
          text: 'def my_decorator(func):\n    def wrapper():\n        print("Something is happening before the function is called.")\n        func()\n        print("Something is happening after the function is called.")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n\nsay_hello()',
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
          text: 'In this example, the decorator function "my_decorator" is used to wrap the "say_hello" function. The "wrapper" function inside the decorator prints messages before and after calling the original function.',
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
          text: "When you run this script, the output will be:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: "shell",
      },
      content: [
        {
          type: "text",
          text: "Something is happening before the function is called.\nHello!\nSomething is happening after the function is called.",
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
          text: 'As you can see, the "my_decorator" function adds behavior to "say_hello" without modifying the function itself. This is particularly useful for aspects that need to be applied across multiple functions.',
        },
      ],
    },
  ],
};

// TODO: validate api response here
// validateSchema(apiContent, extensions);

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
        ctx.editor.commands.setContent(localContent);
      } else {
        ctx.editor.commands.setContent(params.initialContent);
      }
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (params.type === "local") {
        const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
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

  console.log("editorSchema", json5.stringify(editor?.getJSON(), null, 2));
  return {
    editor,
    content: editorContent,
    setContent: handleSetContent,
  };
};

export default useBlockEditor;
