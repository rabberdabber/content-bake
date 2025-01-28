import { useState } from "react";

import { generateHTML, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import extensions from "@/features/editor/components/extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { handleCommandNavigation } from "@/features/editor/components/commands";
import { uploadImage } from "../image/utils";
import { toast } from "sonner";
import json5 from "json5";
import { LocalEditorProps, DatabaseEditorProps } from "@/types/editor";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

const useBlockLocalEditor = ({
  onUpdate,
  storageKey,
  initialContent,
}: LocalEditorProps) => {
  const [localContent, setLocalContent] = useLocalStorage(
    storageKey,
    initialContent ? generateHTML(initialContent, extensions) : ""
  );
  const [_, setDroppedImage] = useState<string | File | null>(null);

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      editor.view.dom.setAttribute("spellcheck", "false");
      editor.view.dom.setAttribute("autocomplete", "off");
      editor.view.dom.setAttribute("autocapitalize", "off");
      ctx.editor.commands.setContent(localContent);
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
      setLocalContent(sanitizedContent);
    },
    extensions: [...extensions],
    content: localContent,
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
    onUpdate(content);
    const sanitizedContent = DOMPurify.sanitize(content, sanitizeConfig);
    setLocalContent(sanitizedContent);
    editor?.commands.setContent(content);
  };

  return {
    editor,
    content: localContent,
    setContent: handleSetContent,
  };
};

const useBlockDatabaseEditor = ({
  onUpdate,
  initialContent,
}: DatabaseEditorProps) => {
  const [editorContent, setEditorContent] = useState(
    generateHTML(initialContent, extensions)
  );
  const [_, setDroppedImage] = useState<string | File | null>(null);

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      editor?.view.dom.setAttribute("spellcheck", "false");
      editor?.view.dom.setAttribute("autocomplete", "off");
      editor?.view.dom.setAttribute("autocapitalize", "off");
      ctx.editor.commands.setContent(initialContent);
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onUpdate(newContent);
    },
    extensions: [...extensions],
    content: initialContent,
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
    onUpdate(content);
    editor?.commands.setContent(content);
  };

  return {
    editor,
    content: editorContent,
    setContent: handleSetContent,
  };
};

export { useBlockLocalEditor, useBlockDatabaseEditor };
