import { useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

import extensions from "@/app/(editor)/extensions";
import useLocalStorage from "./use-local-storage";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { handleCommandNavigation } from "@/components/tiptap-extensions/commands-suggestion";
import { uploadImage } from "../image/utils";
import { toast } from "sonner";
import { useState } from "react";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

const defaultContent = `
<h1>Hello Please Edit the blog</h1>
`;

const useBlockEditor = ({
  setEditorContent,
}: {
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [content, setContent] = useLocalStorage(
    "editor-content",
    defaultContent
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
        ctx.editor.commands.setContent(defaultContent);
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
