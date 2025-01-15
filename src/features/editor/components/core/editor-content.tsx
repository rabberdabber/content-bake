"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { Editor as EditorType } from "@tiptap/react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useScrollIntoView } from "@mantine/hooks";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BlogPreview from "@/features/editor/components/preview/blog-preview";
import { cn } from "@/lib/utils";
import type { EditorMode } from "@/types/editor";

interface EditorContentProps {
  mode: EditorMode;
  editorContent: string;
  setEditorContent: (value: string) => void;
  editorRef: React.RefObject<EditorType>;
  blogRef: React.RefObject<HTMLDivElement>;
  TipTapEditor: React.ComponentType<any>; // dynamic import type
}

/**
 * Renders the Tiptap editor or the preview, or both (split-pane),
 * and handles scrolling to the bottom on content changes.
 */
const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  function EditorContent(
    { mode, editorContent, setEditorContent, editorRef, blogRef, TipTapEditor },
    ref
  ) {
    const controls = useAnimation();
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

    const handleContentScroll = () => {
      controls
        .start({ scale: 1.001, transition: { duration: 0.2 } })
        .then(() =>
          controls.start({ scale: 1, transition: { duration: 0.2 } })
        );
    };

    useEffect(() => {
      scrollIntoView();
    }, [editorContent, scrollIntoView]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        className="flex-1 flex flex-col"
        initial={{ scale: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode} // trigger re-animation on mode change
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {mode === "split-pane" ? (
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50}>
                  <div className="h-full rounded-lg rounded-t-none p-4">
                    <TipTapEditor
                      setEditorContent={setEditorContent}
                      editorRef={editorRef}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                  <BlogPreview blogRef={blogRef} content={editorContent} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <>
                <div className={cn({ hidden: mode === "preview" })}>
                  <div className="rounded-lg rounded-t-none p-4">
                    <TipTapEditor
                      setEditorContent={setEditorContent}
                      editorRef={editorRef}
                    />
                  </div>
                </div>
                <div className={cn({ hidden: mode === "editor" })}>
                  {mode === "preview" && (
                    <BlogPreview blogRef={blogRef} content={editorContent} />
                  )}
                </div>
              </>
            )}
          </motion.div>
          <div ref={targetRef} onScroll={handleContentScroll}></div>
        </AnimatePresence>
      </motion.div>
    );
  }
);

EditorContent.displayName = "EditorContent";

export default EditorContent;
