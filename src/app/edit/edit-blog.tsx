"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { Editor as EditorType } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import ToggleGroup from "@/components/toggle-group";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/html-parser";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";

const TipTapEditor = dynamic(() => import("@/app/(editor)/editor"), {
  ssr: false,
});

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const [mode, setMode] = useState<"editor" | "preview" | "split-pane">(
    "editor"
  );
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

  const onChangeMode = (mode: "editor" | "preview" | "split-pane") => {
    setMode(mode);
    setEditorContent(
      DOMPurify.sanitize(editorRef.current?.getHTML() || "", {
        ADD_TAGS: ["live-code-block"],
      })
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
      <div className="flex justify-end w-full space-x-4 mr-4">
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
        className={`flex p-2 rounded-md ${
          isSplitPane ? "flex-row rounded-md" : "flex-col"
        } w-full gap-4 mb-10`}
      >
        <motion.div
          key="editor"
          {...getAnimationConfig(-1)}
          className={cn(
            `border flex-1 min-h-screen shadow-md rounded-lg p-4 ${
              isSplitPane ? "mr-2 min-w-[calc(50%-2rem)]" : "min-w-full w-full"
            }`,
            mode === "preview" && "hidden"
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
          className={cn("flex-1", mode === "editor" ? "hidden" : "")}
        >
          <article className="relative max-w-full min-h-screen mx-auto grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] p-16 sm:p-16 pb-8 bg-page-background-light dark:bg-page-background-dark shadow-page-light dark:shadow-page-dark sm:border sm:border-page-border-light dark:border-page-border-dark sm:rounded-lg">
            <div
              ref={blogRef}
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert"
            >
              <div className="flex flex-col justify-center items-center gap-8">
                {parse(editorContent, htmlParserOptions)}
              </div>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
};

export default Editor;
