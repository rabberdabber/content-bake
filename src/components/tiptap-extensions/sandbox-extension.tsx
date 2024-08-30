import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Sandbox from "../code/live-code-block";

export default Node.create({
  name: "live-code-block",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-language"),
      },
    };
  },
  parseHTML() {
    return [{ tag: "live-code-block" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "live-code-block",
      mergeAttributes(HTMLAttributes, { class: "mt-12" }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(Sandbox);
  },
});
