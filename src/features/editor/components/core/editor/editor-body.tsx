"use client";

import { forwardRef, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useScrollIntoView } from "@mantine/hooks";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BlogPreview from "@/features/editor/components/preview/blog-preview";
import dynamic from "next/dynamic";
import { useEditor } from "@/features/editor/context/editor-context";
import { cn } from "@/lib/utils";
import { ImperativePanelHandle } from "react-resizable-panels";

const TipTapEditor = dynamic(
  () => import("@/features/editor/components/core/editor"),
  { ssr: false }
);

/**
 * Renders the Tiptap editor or the preview, or both (split-pane),
 * and handles scrolling to the bottom on content changes.
 */
const EditorBody = forwardRef<HTMLDivElement>(function EditorBody(_, ref) {
  const { content, mode, setMode } = useEditor();
  const controls = useAnimation();
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({
    axis: "y",
    duration: 2000,
    easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2), // easeInOutQuint
  });

  // const handleContentScroll = () => {
  //   controls
  //     .start({ scale: 1.001, transition: { duration: 0.2 } })
  //     .then(() =>
  //       controls.start({ scale: 1, transition: { duration: 0.2 } })
  //     );
  // };

  const leftRef = useRef<ImperativePanelHandle>(null);
  const rightRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) {
      return;
    }
    if (mode === "editor") {
      leftRef.current.expand();
      rightRef.current.collapse();
    } else if (mode === "preview") {
      leftRef.current.collapse();
      rightRef.current.expand();
    } else if (mode === "split-pane") {
      leftRef.current.expand();
      rightRef.current.expand();

      leftRef.current.resize(50);
      rightRef.current.resize(50);
    }
  }, [mode]);

  useEffect(() => {
    // scrollIntoView();
  }, [content, scrollIntoView]);

  useEffect(() => {
    console.log("editor body on mount");
    return () => {
      console.log("editor body on unmount");
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-h-full max-w-full"
    >
      {/* Left panel collapses when mode === 'preview' */}
      <ResizablePanel
        ref={leftRef}
        collapsible
        onCollapse={() => {
          if (mode === "preview") {
            setMode("editor");
          }
        }}
        defaultSize={50}
        className={mode === "preview" ? "h-0" : ""}
      >
        <TipTapEditor />
      </ResizablePanel>

      <ResizableHandle className={mode === "split-pane" ? "" : "hidden"} />

      {/* Right panel collapses when mode === 'editor' */}
      <ResizablePanel
        ref={rightRef}
        collapsible
        onCollapse={() => {
          if (mode === "editor") {
            setMode("preview");
          }
        }}
        defaultSize={50}
        className={mode === "editor" ? "h-0" : ""}
      >
        <BlogPreview />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});

EditorBody.displayName = "EditorBody";

export default EditorBody;
