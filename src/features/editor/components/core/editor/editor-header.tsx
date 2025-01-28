"use client";

import { cn } from "@/lib/utils";
import ToggleGroup from "@/components/ui/toggle-group";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/features/editor/context/editor-context";
import { Separator } from "@/components/ui/separator";

export default function EditorHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { editor, mode, setMode } = useEditor();
  const isSplitPane = mode === "split-pane";
  if (!editor) return null;

  return (
    <div
      className={cn(
        "mt-2 sticky top-16 flex flex-row flex-wrap max-w-full gap-2 items-center justify-between border border-border/40 p-2 rounded-t-lg mx-2 z-40",
        "transition-all duration-200",
        "backdrop-blur-md backdrop-saturate-150 border-border/40 bg-muted-foreground/5"
      )}
    >
      {/* Mode toggles */}
      <ToggleGroup
        iconsWithTooltip={[
          {
            icon: Icons.splitPane,
            tooltip: "split pane",
            onClick: () => setMode("split-pane"),
            selected: isSplitPane,
          },
          {
            icon: Icons.edit,
            tooltip: "Editor",
            onClick: () => setMode("editor"),
            selected: mode === "editor",
          },
          {
            icon: Icons.eye,
            tooltip: "Preview",
            onClick: () => setMode("preview"),
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
            <Icons.undo className="h-6 w-6" />
            Undo
          </Button>
          <Separator orientation="vertical" className="h-10 w-px" />
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
          >
            <Icons.redo className="h-6 w-6" />
            Redo
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}
