"use client";

import { cn } from "@/lib/utils";
import ToggleGroup from "@/components/ui/toggle-group";
import { Icons } from "@/components/icons";
import { EditorActions } from "@/features/editor/components/core/editor-actions";
import type { EditorMode } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/features/editor/context/editor-context";
import { useState } from "react";

interface EditorHeaderProps {
  mode: EditorMode;
  onChangeMode: (mode: EditorMode) => void;
  fullscreen: boolean;
  onSave?: () => Promise<void>;
}

export default function EditorHeader({
  mode,
  onChangeMode,
  fullscreen,
  onSave,
}: EditorHeaderProps) {
  const isSplitPane = mode === "split-pane";
  const { editor } = useEditor();
  const [isSaving, setIsSaving] = useState(false);

  if (!editor) return null;

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setIsSaving(true);
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 flex flex-row flex-wrap gap-2 items-center justify-between border border-border/40 p-2 rounded-t-lg m-0 z-40",
        "transition-all duration-200",
        "backdrop-blur-md backdrop-saturate-150 border-border/40 bg-muted-foreground/5",
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

      <div className="flex items-center gap-4">
        {/* Editor toolbar */}
        <div className="flex gap-2 border-2 border-border/50 bg-muted-foreground/5 rounded-md p-1">
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
          >
            <Icons.undo className="h-6 w-6 border-2 border-foreground/10 rounded-md p-1" />
            Undo
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
          >
            <Icons.redo className="h-6 w-6 border-2 border-foreground/10 rounded-md p-1" />
            Redo
          </Button>
        </div>

        {/* Save button */}
        {onSave && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Icons.loader className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}

        {/* Editor actions */}
        <EditorActions />
      </div>
    </div>
  );
}
