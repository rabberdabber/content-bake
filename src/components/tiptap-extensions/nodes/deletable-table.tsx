import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { DeletableNodeWrapper } from "../deletable-node-wrapper";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Editor } from "@tiptap/core";

interface DeletableTableProps extends NodeViewProps {
  editor: Editor;
}

export function DeletableTable({ deleteNode, editor }: DeletableTableProps) {
  const tableControls = [
    {
      icon: <Icons.plus className="h-4 w-4" />,
      label: "Add column before",
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: <Icons.plus className="h-4 w-4" />,
      label: "Add column after",
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: <Icons.trash className="h-4 w-4" />,
      label: "Delete column",
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      icon: <Icons.plus className="h-4 w-4" />,
      label: "Add row before",
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: <Icons.plus className="h-4 w-4" />,
      label: "Add row after",
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: <Icons.trash className="h-4 w-4" />,
      label: "Delete row",
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
    {
      icon: <Icons.columns2 className="h-4 w-4" />,
      label: "Merge cells",
      onClick: () => editor.chain().focus().mergeCells().run(),
    },
    {
      icon: <Icons.splitSquareHorizontal className="h-4 w-4" />,
      label: "Split cell",
      onClick: () => editor.chain().focus().splitCell().run(),
    },
    {
      icon: <Icons.Table className="h-4 w-4" />,
      label: "Toggle header row",
      onClick: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      icon: <Icons.Table className="h-4 w-4" />,
      label: "Toggle header column",
      onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
  ];

  return (
    <NodeViewWrapper as="div">
      <DeletableNodeWrapper deleteNode={deleteNode}>
        <div className="relative group mt-5">
          <div className="absolute -top-24 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md shadow-sm">
              {tableControls.map((control, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={control.onClick}
                  className="h-auto py-1 px-2 flex gap-2 items-center text-xs"
                >
                  {control.icon}
                  <span>{control.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <NodeViewContent as="table" spellCheck="false" />
        </div>
      </DeletableNodeWrapper>
    </NodeViewWrapper>
  );
}
