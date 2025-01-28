import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function DeletableTable({ node, deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper
      as="div"
      className="group relative w-full not-prose my-4 flex"
    >
      <div className="flex-grow w-full overflow-x-auto">
        <NodeViewContent
          as="table"
          className={cn(
            "w-full border-collapse",
            "table-auto border-spacing-0",
            "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:flex-grow",
            "[&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:flex-grow",
            "[&_tr]:flex [&_tr]:w-full",
            "[&_td]:flex-1 [&_th]:flex-1"
          )}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-2 z-10 h-8 w-8",
          "bg-background/80 backdrop-blur-sm",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-200",
          "hover:bg-destructive hover:text-destructive-foreground"
        )}
        onClick={deleteNode}
      >
        <Icons.trash className="h-4 w-4" />
      </Button>
    </NodeViewWrapper>
  );
}
