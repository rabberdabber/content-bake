"use client";

import { cn } from "@/lib/utils";
import ToggleGroup from "@/components/ui/toggle-group";
import { Icons } from "@/components/icons";
import { EditorActions } from "@/features/editor/components/core/editor-actions";
import { Editor as EditorType } from "@tiptap/react";
import type { EditorMode } from "@/types/editor";

interface EditorHeaderProps {
  mode: EditorMode;
  onChangeMode: (newMode: EditorMode) => void;
  editorRef: React.RefObject<EditorType>;
  featuredImage: string;
  fullscreen: boolean;
}

export default function EditorHeader({
  mode,
  onChangeMode,
  editorRef,
  featuredImage,
  fullscreen,
}: EditorHeaderProps) {
  const isSplitPane = mode === "split-pane";

  console.log("editor header", fullscreen);
  return (
    <div
      className={cn(
        "sticky top-0 flex-col md:flex-row gap-2 items-center justify-between border border-border/40 p-2 rounded-t-lg m-0 z-40",
        "transition-all duration-200",
        "bg-background/80 backdrop-blur-md backdrop-saturate-150 border-border/40",
        !fullscreen && "sticky top-16"
      )}
    >
      {/* Mode toggles */}
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

      {/* Editor actions */}
      <div className="flex gap-2 justify-end w-full">
        <EditorActions
          editor={editorRef.current}
          featuredImage={featuredImage}
        />
      </div>
    </div>
  );
}
