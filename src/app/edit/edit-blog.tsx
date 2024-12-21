"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { Editor as EditorType } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import ToggleGroup from "@/components/toggle-group";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";
import type { EditorMode } from "./types";
import { sanitizeConfig } from "@/config/sanitize-config";
import BlogPreview from "@/components/blog/blog-preview";

const TipTapEditor = dynamic(() => import("@/app/(editor)/editor"), {
  ssr: false,
});

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const [mode, setMode] = useState<EditorMode>("editor");
  const isSplitPane = mode === "split-pane";
  const editorRef = useRef<EditorType>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  const getAnimationConfig = (direction: number) => ({
    initial: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : direction * 20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        stiffness: 100,
        damping: 10,
        mass: 0.5,
        duration: shouldReduceMotion ? 0 : 0.7,
      },
    },
    exit: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : direction * 20,
      transition: {
        type: "spring",
        bounce: 0.3,
        stiffness: 100,
        damping: 10,
        mass: 0.5,
        duration: shouldReduceMotion ? 0 : 0.7,
      },
    },
  });

  const onChangeMode = (mode: EditorMode) => {
    setMode(mode);
    setEditorContent(
      DOMPurify.sanitize(editorRef.current?.getHTML() || "", sanitizeConfig)
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-1 justify-center items-center w-full max-w-7xl mx-auto",
        mode === "split-pane" && "max-w-[calc(100dvw-4rem)]"
      )}
    >
      <div className="flex justify-end w-full px-4">
        <ToggleGroup
          iconsWithTooltip={[
            {
              icon: Icons.splitPane,
              tooltip: "split pane",
              onClick: () => onChangeMode("split-pane"),
              selected: isSplitPane,
            },
            {
              icon: Icons.edit,
              tooltip: "Editor",
              onClick: () => onChangeMode("editor"),
              selected: mode === "editor",
            },
            {
              icon: Icons.preview,
              tooltip: "Preview",
              onClick: () => onChangeMode("preview"),
              selected: mode === "preview",
            },
          ]}
        />
      </div>
      <div
        className={cn(
          "flex p-2 rounded-md flex-col w-full gap-4 mb-10",
          isSplitPane && "flex-row rounded-md",
          mode === "editor" && "overflow-hidden"
        )}
      >
        <motion.div
          key="editor"
          {...getAnimationConfig(-1)}
          className={cn(
            `border-2 flex-1 shadow-xl rounded-lg p-4 overflow-y-auto max-h-[75dvh] ${
              isSplitPane ? "mr-2 min-w-[calc(50%-2rem)]" : "min-w-full w-full"
            }`,
            mode === "preview" && "hidden",
            "border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-md"
          )}
        >
          <TipTapEditor
            setEditorContent={setEditorContent}
            editorRef={editorRef}
          />
        </motion.div>
        {isSplitPane && <Separator orientation="vertical" className="h-full" />}
        <motion.div
          key="preview"
          {...getAnimationConfig(1)}
          className={cn(
            "flex-1",
            mode === "editor" ? "hidden" : "",
            "border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-md"
          )}
        >
          <BlogPreview content={editorContent} blogRef={blogRef} />
        </motion.div>
      </div>
    </div>
  );
};

export default Editor;
