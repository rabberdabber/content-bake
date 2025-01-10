"use client";
import "@/styles/index.css";
import React, { useEffect, useRef, useState } from "react";
import { EditorContent, Editor as EditorType } from "@tiptap/react";
import EditorBubble from "../toolbar/editor-bubble";
import { Separator } from "@/components/ui/separator";
import { NodeSelector } from "../toolbar/selectors/node-selector";
import { LinkSelector } from "../toolbar/selectors/link-selector";
import { TextButtons } from "../toolbar/selectors/text-buttons";
import { ColorSelector } from "../toolbar/selectors/color-selector";
import useBlockEditor from "@/lib/hooks/use-editor";
import { ImageBlockMenu } from "../toolbar/image-block-menu";

export type TipTapEditorType = EditorType;

type EditorProps = {
  editorRef: React.MutableRefObject<EditorType | null>;
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
};

const Editor = ({ editorRef, setEditorContent }: EditorProps) => {
  const { editor } = useBlockEditor({ setEditorContent });
  const [image, setImage] = useState<string | File | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const menuContainerRef = useRef(null);
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
      editorElement.addEventListener("openVideoDialog", () => {
        // TODO: create a dialog for video
        addVideo();
      });
      return () => {
        editorElement.removeEventListener("openVideoDialog", () => {});
      };
    }
  }, [editor, openVideoDialog]);

  if (!editor) {
    return null;
  }

  const addVideo = () => {
    const url = prompt("Enter Video URL");

    if (url) {
      editor?.commands.setVideo(url);
    }
  };

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl dark:bg-white"
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
        <EditorContent editor={editor} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

const TipTapEditor = ({ editorRef, setEditorContent }: EditorProps) => {
  return <Editor editorRef={editorRef} setEditorContent={setEditorContent} />;
};

export default TipTapEditor;
