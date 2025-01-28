"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { EditorContainerProps, EditorMode } from "@/types/editor";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { useMounted } from "@/lib/hooks/use-mounted";
import { breakpoints, useMediaQuery } from "@/lib/hooks/use-media-query";
import { toast } from "sonner";
import EditorHeader from "./core/editor-header";
import EditorContent from "./core/editor-content";
import { motion, AnimatePresence } from "framer-motion";
import { EditorProvider, useEditor } from "../context/editor-context";

function Editor({
  mode,
  setMode,
}: {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogRef = useRef<HTMLDivElement>(null);
  const isMounted = useMounted();
  const isMobile = !useMediaQuery(breakpoints.md);
  const { content, setContent, editor } = useEditor();

  // Update mode when `mode` changes (sync URL and sanitize content)
  const onChangeMode = (newMode: EditorMode) => {
    setMode(newMode);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.push(`?${params.toString()}`);

    // Sanitize content and store
    if (editor) {
      setContent(DOMPurify.sanitize(editor.getHTML() || "", sanitizeConfig));
    }
  };

  // Warn on mobile and set client
  useEffect(() => {
    if (isMobile && isMounted) {
      toast.warning(
        "This editor is optimized for desktop use. Mobile experience may be limited."
      );
    }
    setIsClient(true);
  }, [isMobile, isMounted]);

  if (!isClient || !editor) {
    return null;
  }

  return (
    <div className="relative">
      <EditorContent mode={mode} editor={editor} blogRef={blogRef} />
    </div>
  );
}

export function EditorContainer({
  editor,
  content,
  setContent,
  labels,
  actions,
  loadingState,
  children,
}: EditorContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode = (searchParams.get("mode") as EditorMode) || "editor";
  const [mode, setMode] = useState<EditorMode>(currentMode);

  // Check if URL mode changes externally
  useEffect(() => {
    const modeFromUrl = searchParams.get("mode") as EditorMode | null;
    if (
      modeFromUrl &&
      ["editor", "preview", "split-pane"].includes(modeFromUrl)
    ) {
      setMode(modeFromUrl);
    }
  }, [searchParams]);

  return (
    <EditorProvider
      content={content}
      setContent={setContent}
      editor={editor}
      labels={labels}
      actions={actions}
      loadingState={loadingState}
    >
      <div className="container relative mx-auto min-h-screen border-2 border-border/50 rounded-md mt-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="sticky top-16 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="border-b mt-4">
                  <EditorHeader
                    mode={mode}
                    onChangeMode={(newMode) => {
                      setMode(newMode);
                      const params = new URLSearchParams(searchParams);
                      params.set("mode", newMode);
                      router.push(`?${params.toString()}`);
                    }}
                  >
                    {children}
                  </EditorHeader>
                </div>
              </div>
              <Editor mode={mode} setMode={setMode} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </EditorProvider>
  );
}
