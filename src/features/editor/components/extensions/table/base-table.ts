import TiptapTable from "@tiptap/extension-table";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DeletableTable } from "./deletable-table";

export const Table = TiptapTable.extend({
  addNodeView() {
    return ReactNodeViewRenderer(DeletableTable);
  },
}).configure({
  resizable: true,
  lastColumnResizable: false,
});

export default Table;
