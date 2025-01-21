"use client";
import "@/styles/index.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent } from "@tiptap/react";
import EditorBubble from "../toolbar/editor-bubble";
import { Separator } from "@/components/ui/separator";
import { NodeSelector } from "../toolbar/selectors/node-selector";
import { LinkSelector } from "../toolbar/selectors/link-selector";
import { TextButtons } from "../toolbar/selectors/text-buttons";
import { ColorSelector } from "../toolbar/selectors/color-selector";
import { ImageBlockMenu } from "../toolbar/image-block-menu";
import { AIContentGenerator } from "./ai/content-generator";
import { useScrollIntoView } from "@mantine/hooks";
import { useAnimationControls } from "framer-motion";
import { TableColumnMenu } from "../extensions/table/menus";
import { TableRowMenu } from "../extensions/table/menus";
import { useEditor } from "../../context/editor-context";

const CoreEditor = () => {
  const { editor, content } = useEditor();
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAIContentDialog, setOpenAIContentDialog] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const menuContainerRef = useRef(null);

  const handleClose = useCallback(() => {
    setOpenAIContentDialog(false);
    setChatId(null);
  }, []);

  useEffect(() => {
    const handleOpenDialog = () => {
      setOpenAIContentDialog(true);
      setChatId(crypto.randomUUID());
    };
    window.addEventListener("openAIContentDialog", handleOpenDialog);

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openAIContentDialog) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("openAIContentDialog", handleOpenDialog);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [openAIContentDialog]);

  if (!editor) {
    return null;
  }

  // console.log(JSON.stringify(editor.getJSON(), null, 2));
  // console.table(editor.schema.spec.nodes);
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
        <EditorContent editor={editor} content={content} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />

        {chatId && (
          <AIContentGenerator
            editor={editor}
            open={openAIContentDialog}
            setOpen={setOpenAIContentDialog}
            chatId={chatId}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

const TipTapEditor = () => {
  const { content } = useEditor();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    axis: "y",
    duration: 2000,
    easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2), // easeInOutQuint
  });
  const controls = useAnimationControls();

  const handleContentScroll = () => {
    controls
      .start({ scale: 1.001, transition: { duration: 0.2 } })
      .then(() => controls.start({ scale: 1, transition: { duration: 0.2 } }));
  };

  useEffect(() => {
    // scrollIntoView();
  }, [content]);

  return (
    <>
      <CoreEditor />
      <div ref={targetRef} onScroll={handleContentScroll}></div>
    </>
  );
};

export default TipTapEditor;
