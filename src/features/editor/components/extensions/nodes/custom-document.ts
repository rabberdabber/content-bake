import { Node } from "@tiptap/core";

export const CustomDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "heading block*",

  addOptions() {
    return {
      defaultType: "heading",
      defaultLevel: 1,
    };
  },
});
