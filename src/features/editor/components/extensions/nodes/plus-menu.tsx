import React from "react";
import { Icons } from "@/components/icons";
import type { TipTapEditorType } from "@/features/editor/components/core/editor";

const PlusMenuComponent: React.FC<{ editor: TipTapEditorType }> = ({
  editor,
}) => {
  if (!editor) return null;

  const { state } = editor;
  const { $from } = state.selection;
  const currentNode = $from.node();

  // Only show for empty paragraphs
  if (currentNode.type.name !== "paragraph" || currentNode.content.size !== 0) {
    return null;
  }

  return (
    <button
      onClick={() => {
        editor.chain().focus().insertContent("/").run();
        editor.commands.enter();
      }}
      className="absolute -left-6 top-[50%] -translate-y-[50%] opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Icons.plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );
};

export default PlusMenuComponent;
