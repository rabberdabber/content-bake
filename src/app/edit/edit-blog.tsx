"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Editor as EditorType } from "@tiptap/react";
import type { EditorMode } from "./types";
import { sanitizeConfig } from "@/config/sanitize-config";
import { Icons } from "@/components/icons";
import ToggleGroup from "@/components/ui/toggle-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BlogPreview from "@/features/editor/components/preview/blog-preview";
import { EditorActions } from "@/features/editor/components/core/editor-actions";
import {
  useUploader,
  useFileUpload,
  useDropZone,
} from "@/hooks/image/file-hooks";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { useLocalStorage } from "@mantine/hooks";
import { useScroll } from "@/lib/hooks/use-scroll";

const TipTapEditor = dynamic(
  () => import("@/features/editor/components/core/editor"),
  {
    ssr: false,
  }
);

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [editorContent, setEditorContent] = useLocalStorage({
    key: "editor-content",
    defaultValue: "",
  });
  const [featuredImage, setFeaturedImage] = useLocalStorage({
    key: "featured-image",
    defaultValue: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentMode = searchParams.get("mode") as EditorMode | null;
  const [mode, setMode] = useState<EditorMode>(currentMode || "editor");

  const isSplitPane = mode === "split-pane";
  const editorRef = useRef<EditorType>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  const { loading, uploadFile } = useUploader({
    onUpload: (url) => {
      setFeaturedImage(url);
    },
  });

  const { ref: fileInputRef, handleUploadClick } = useFileUpload();

  const { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop } =
    useDropZone({
      uploader: uploadFile,
    });

  const scrolled = useScroll(20);

  const onChangeMode = (newMode: EditorMode) => {
    setMode(newMode);
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.push(`?${params.toString()}`);

    setEditorContent(
      DOMPurify.sanitize(editorRef.current?.getHTML() || "", sanitizeConfig)
    );
  };

  useEffect(() => {
    const modeFromUrl = searchParams.get("mode") as EditorMode | null;
    if (
      modeFromUrl &&
      ["editor", "preview", "split-pane"].includes(modeFromUrl)
    ) {
      setMode(modeFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Editor Header */}
      <div
        className={cn(
          "sticky top-16 flex items-center justify-between border border-border/40 p-2 rounded-t-lg m-0 z-40 mt-16",
          "transition-all duration-200",
          scrolled
            ? "bg-background/80 backdrop-blur-md backdrop-saturate-150 border-border/40"
            : "bg-foreground/10"
        )}
      >
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
        <div className="flex gap-2 justify-end w-full">
          <EditorActions
            editor={editorRef.current}
            featuredImage={featuredImage}
          />
        </div>
      </div>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-none border-t-0 p-4 transition-colors",
          draggedInside ? "border-primary" : "border-border/40",
          "hover:border-primary cursor-pointer"
        )}
        onClick={handleUploadClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />

        {featuredImage ? (
          <div className="relative mx-auto w-full aspect-[4/1] rounded-lg overflow-hidden">
            <Image
              src={featuredImage}
              alt="Feature image"
              fill
              className="object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeaturedImage("");
              }}
              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
            >
              <Icons.x className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <Icons.image className="h-6 w-6 mb-2" />
            <p className="text-sm">
              {loading
                ? "Uploading..."
                : "Click or drag and drop to add a feature image"}
            </p>
          </div>
        )}
      </div>

      {mode === "split-pane" ? (
        <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
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
            <div className="border rounded-lg rounded-t-none p-4 min-h-[500px]">
              <TipTapEditor
                setEditorContent={setEditorContent}
                editorRef={editorRef}
              />
            </div>
            {mode === "preview" && (
              <BlogPreview blogRef={blogRef} content={editorContent} />
            )}
          </div>
          <div className={cn({ hidden: mode === "editor" })}>
            {mode === "preview" && (
              <BlogPreview blogRef={blogRef} content={editorContent} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
