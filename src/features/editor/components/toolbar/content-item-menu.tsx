import { Icons } from "@/components/icons";
import { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import useContentItemActions from "@/lib/hooks/use-content-item-actions";
import { useData } from "@/lib/hooks/use-data";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Toolbar } from "@/components/ui/toolbar";

export type ContentItemMenuProps = {
  editor: Editor;
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const MenuItem = ({ icon, label, onClick, className }: MenuItemProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2 px-2 py-1 text-sm justify-start font-normal",
      className
    )}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  );

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <div className="flex items-center gap-0.5">
      <Toolbar.Button onClick={actions.handleAdd}>
        <Icons.plus />
      </Toolbar.Button>
      <Popover modal={true} open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Toolbar.Button>
            <Icons.gripVertical />
          </Toolbar.Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={5}
          className="my-1 flex w-48 flex-col overflow-hidden rounded border p-1 shadow-xl"
          align="start"
        >
          <div className="flex flex-col space-y-0.5">
            <MenuItem
              icon={<Icons.format className="h-4 w-4" />}
              label="Clear formatting"
              onClick={actions.resetTextFormatting}
            />
            <MenuItem
              icon={<Icons.copy className="h-4 w-4" />}
              label="Copy to clipboard"
              onClick={actions.copyNodeToClipboard}
            />
            <MenuItem
              icon={<Icons.copy className="h-4 w-4" />}
              label="Duplicate"
              onClick={actions.duplicateNode}
            />
            <div className="my-1 border-t border-muted" />
            <MenuItem
              icon={<Icons.trash className="h-4 w-4" />}
              label="Delete"
              onClick={actions.deleteNode}
              className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
