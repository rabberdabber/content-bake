"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { EditorMode } from "@/types/editor";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useFullscreen } from "@mantine/hooks";
import { breakpoints, useMediaQuery } from "@/lib/hooks/use-media-query";
import { toast } from "sonner";
import EditorHeader from "./core/editor-header";
import EditorContent from "./core/editor-content";
import useBlockEditor from "@/lib/hooks/use-editor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { EditorProvider, useEditor } from "../context/editor-context";

type EditorContainerProps = {
  onSave?: (content: string) => Promise<void>;
  isDraft: boolean;
  isDemo: boolean;
} & (
  | {
      type: "initial";
      initialContent: string;
    }
  | {
      type: "local";
      storageKey: string;
    }
);

function Editor({
  mode,
  setMode,
  fullscreen,
}: {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  fullscreen: boolean;
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
  onSave,
  isDraft = false,
  isDemo = false,
  ...props
}: EditorContainerProps) {
  const { editor, content, setContent } = useBlockEditor(props);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode = (searchParams.get("mode") as EditorMode) || "editor";
  const [mode, setMode] = useState<EditorMode>(currentMode);
  const { fullscreen, toggle } = useFullscreen();

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

  const editorContent = (
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
            fullscreen={fullscreen}
            onSave={
              onSave
                ? async () => {
                    if (editor) {
                      const content = editor.getHTML();
                      await onSave(content);
                    }
                  }
                : undefined
            }
          />
        </div>
      </div>
      <Editor mode={mode} setMode={setMode} fullscreen={fullscreen} />
    </div>
  );

  return (
    <EditorProvider
      isDemo={isDemo}
      isDraft={isDraft}
      content={content}
      setContent={setContent}
      editor={editor}
      {...props}
    >
      <div className="container relative mx-auto min-h-screen border-2 border-border/50 rounded-md mt-4">
        <AnimatePresence>
          {fullscreen ? (
            <Dialog open={fullscreen} modal onOpenChange={toggle}>
              <DialogContent className="w-screen min-h-screen max-w-full max-h-full p-0 border-none bg-background overflow-y-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {editorContent}
                </motion.div>
              </DialogContent>
            </Dialog>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {editorContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EditorProvider>
  );
}
