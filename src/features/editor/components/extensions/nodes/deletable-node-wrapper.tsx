import { NodeViewProps } from "@tiptap/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeletableNodeWrapperProps {
  children: React.ReactNode;
  deleteNode: NodeViewProps["deleteNode"];
  className?: string;
  width?: number;
  height?: number;
}

export function DeletableNodeWrapper({
  children,
  deleteNode,
  className,
}: DeletableNodeWrapperProps) {
  return (
    <div className={cn("group relative", className)}>
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
      {children}
    </div>
  );
}
