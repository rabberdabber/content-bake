"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor, Editor as EditorType } from "@tiptap/react";
import EditorBubble from "./editor-bubble";
import { Separator } from "@/components/ui/separator";
import ImageUploadDialog from "@/components/dialogs/image-upload-dialog";
import extensions from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";
import { MediaResizer } from "@/components/tiptap-extensions/media-resizer";
import { handleCommandNavigation } from "@/components/tiptap-extensions/commands-suggestion";
import DOMPurify from "dompurify";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { uploadImage } from "@/lib/image/utils";
import { cn } from "@/lib/utils";
import { sanitizeConfig } from "@/config/sanitize-config";

const defaultContent = `
<h1>Hello Please Edit the blog</h1>
`;

export type TipTapEditorType = EditorType;

type EditorProps = {
  editorRef: React.MutableRefObject<EditorType | null>;
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
};

const Editor = ({ editorRef, setEditorContent }: EditorProps) => {
  const [content, setContent] = useLocalStorage(
    "editor-content",
    defaultContent
  );
  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onContentUpdate(newContent);
      setContent(newContent);
    },
    extensions: extensions,
    content: content,
    autofocus: "start",
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
          uploadImage(file).then((imageUrl) => setImage(imageUrl));
          return true;
        }
      },
    },
  });
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [image, setImage] = useState<string | File | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openYoutubeDialog, setOpenYoutubeDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const onContentUpdate = (newContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(newContent, sanitizeConfig);
    setEditorContent?.(sanitizedContent);
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 480,
        height: 480,
      });
    }
  };

  const addVideo = () => {
    const url = prompt("Enter Video URL");

    if (url) {
      editor?.commands.setVideo(url);
    }
  };

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  useEffect(() => {
    if (editor && image) {
      editor
        .chain()
        .focus()
        .setImage({
          src:
            typeof image === "string"
              ? image
              : URL.createObjectURL(image as File),
        })
        .run();
    }
  }, [image]);

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("openImageDialog", () => {
        setOpenImageDialog(true);
      });
      return () => {
        editorElement.removeEventListener("openImageDialog", () => {});
      };
    }
  }, [editor, openImageDialog]);

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("openVideoDialog", () => {
        // TODO: create a dialog for video
        addVideo();
      });
      return () => {
        editorElement.removeEventListener("openVideoDialog", () => {});
      };
    }
  }, [editor, openVideoDialog]);

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("openYoutubeDialog", () => {
        //TODO: create a dialog for youtube video
        addYoutubeVideo();
      });
      return () => {
        editorElement.removeEventListener("openYoutubeDialog", () => {});
      };
    }
  }, [editor, openYoutubeDialog]);

  return (
    <div className="mt-[2rem]">
      <EditorBubble
        tippyOptions={{
          placement: "top",
        }}
        className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        editor={editor}
      >
        <Separator orientation="vertical" />
        <NodeSelector
          open={openNode}
          onOpenChange={setOpenNode}
          editor={editor}
        />
        <Separator orientation="vertical" />

        <LinkSelector
          open={openLink}
          onOpenChange={setOpenLink}
          editor={editor}
        />
        <Separator orientation="vertical" />
        <TextButtons editor={editor} />
        <Separator orientation="vertical" />
        <ColorSelector
          open={openColor}
          onOpenChange={setOpenColor}
          editor={editor}
        />
      </EditorBubble>
      <EditorContent
        editor={editor}
        className={cn(openImageDialog ? "blur-sm" : "")}
      />
      {!openImageDialog && <MediaResizer editor={editor} />}
      <div className="relative mb-4 mt-4">
        <ImageUploadDialog
          image={image}
          setImage={setImage}
          open={openImageDialog}
          setOpen={setOpenImageDialog}
          onSubmit={() => setOpenImageDialog(false)}
          onCancel={() => setOpenImageDialog(false)}
        />
      </div>
    </div>
  );
};

const TipTapEditor = ({ editorRef, setEditorContent }: EditorProps) => {
  return <Editor editorRef={editorRef} setEditorContent={setEditorContent} />;
};

export default TipTapEditor;
