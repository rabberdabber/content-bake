"use client";

import { forwardRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
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
import { useEditor } from "../../context/editor-context";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(
  () => import("@/features/editor/components/core/editor"),
  { ssr: false }
);

interface EditorContentProps {
  mode: EditorMode;
  editor: Editor;
  blogRef: React.RefObject<HTMLDivElement>;
}

/**
 * Renders the Tiptap editor or the preview, or both (split-pane),
 * and handles scrolling to the bottom on content changes.
 */
const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  function EditorContent({ mode, editor, blogRef }, ref) {
    const { content } = useEditor();
    const controls = useAnimation();
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
      axis: "y",
      duration: 2000,
      easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2), // easeInOutQuint
    });

    const handleContentScroll = () => {
      controls
        .start({ scale: 1.001, transition: { duration: 0.2 } })
        .then(() =>
          controls.start({ scale: 1, transition: { duration: 0.2 } })
        );
    };

    useEffect(() => {
      // scrollIntoView();
    }, [content, scrollIntoView]);

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
                    <TipTapEditor />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                  <BlogPreview blogRef={blogRef} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <>
                <div className={cn({ hidden: mode === "preview" })}>
                  <div className="rounded-lg rounded-t-none p-4">
                    <TipTapEditor />
                  </div>
                </div>
                <div className={cn({ hidden: mode === "editor" })}>
                  {mode === "preview" && <BlogPreview blogRef={blogRef} />}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }
);

EditorContent.displayName = "EditorContent";

export default EditorContent;
