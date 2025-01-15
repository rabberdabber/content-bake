"use client";

import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  forwardRef,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Editor as EditorType } from "@tiptap/react";
import type { EditorMode } from "@/types/editor";
import { sanitizeConfig } from "@/config/sanitize-config";

import DOMPurify from "dompurify";
import { useLocalStorage } from "@mantine/hooks";
import { useFullscreen } from "@mantine/hooks";
import { breakpoints, useMediaQuery } from "@/lib/hooks/use-media-query";
import { toast } from "sonner";
// Sub-components
import EditorHeader from "@/features/editor/components/core/editor-header";
import FeatureImageUpload from "@/features/editor/components/core/feature-image-upload";
import EditorContent from "@/features/editor/components/core/editor-content";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const TipTapEditor = dynamic(
  () => import("@/features/editor/components/core/editor"),
  {
    ssr: false,
  }
);

interface EditorProps {
  searchParams: ReturnType<typeof useSearchParams>;
  router: ReturnType<typeof useRouter>;
}

const Editor = forwardRef<
  HTMLDivElement,
  EditorProps & { fullscreen: boolean }
>(({ fullscreen, searchParams, router }, ref) => {
  // Track client rendering to avoid SSR mismatch
  const [isClient, setIsClient] = useState(false);

  // Track state for editor content and featured image
  const [editorContent, setEditorContent] = useLocalStorage({
    key: "editor-content",
    defaultValue: "",
  });
  const [featuredImage, setFeaturedImage] = useLocalStorage({
    key: "featured-image",
    defaultValue: "",
  });

  // Determine current mode from search params or fallback to 'editor'
  const currentMode = (searchParams.get("mode") as EditorMode) || "editor";
  const [mode, setMode] = useState<EditorMode>(currentMode);

  // Keep references for Tiptap and blog preview
  const editorRef = useRef<EditorType>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  // Mobile check
  const isMobile = !useMediaQuery(breakpoints.md);

  // Update mode when `mode` changes (sync URL and sanitize content)
  const onChangeMode = (newMode: EditorMode) => {
    setMode(newMode);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.push(`?${params.toString()}`);

    // Sanitize content and store
    setEditorContent(
      DOMPurify.sanitize(editorRef.current?.getHTML() || "", sanitizeConfig)
    );
  };

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

  // Warn on mobile and set client
  useEffect(() => {
    if (isMobile) {
      toast.warning(
        "This editor is optimized for desktop use. Mobile experience may be limited."
      );
    }
    setIsClient(true);
  }, [isMobile]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="relative" ref={ref}>
      {/* Header */}
      <EditorHeader
        mode={mode}
        onChangeMode={onChangeMode}
        editorRef={editorRef}
        featuredImage={featuredImage}
        fullscreen={fullscreen}
      />

      {/* Image Upload */}
      <FeatureImageUpload
        featuredImage={featuredImage}
        setFeaturedImage={setFeaturedImage}
      />

      {/* Main Editor Content (Tiptap & Preview) */}
      <EditorContent
        mode={mode}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        editorRef={editorRef}
        blogRef={blogRef}
        TipTapEditor={TipTapEditor}
      />
    </div>
  );
});

Editor.displayName = "Editor";

// Default export wrapped with Suspense
export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { ref, fullscreen, toggle } = useFullscreen();

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <AnimatePresence>
        {fullscreen ? (
          <Dialog open={fullscreen} modal onOpenChange={toggle}>
            <DialogContent className="w-screen min-h-screen max-w-full max-h-full p-0 border-none bg-background overflow-y-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Editor
                  fullscreen={fullscreen}
                  searchParams={searchParams}
                  router={router}
                  ref={ref}
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative container mx-auto p-2"
          >
            <Editor
              fullscreen={fullscreen}
              searchParams={searchParams}
              router={router}
              ref={ref}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Suspense>
  );
}
