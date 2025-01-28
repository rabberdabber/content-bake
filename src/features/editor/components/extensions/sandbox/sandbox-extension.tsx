import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { EditorSandbox } from "../../core/code/live-code-block";
import { templateFiles } from "@/config/sandbox";

export default Node.create({
  name: "livecodeblock",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      id: {
        default: crypto.randomUUID(),
        parseHTML: (element) =>
          element.getAttribute("data-id") || crypto.randomUUID(),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
      language: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-language"),
      },
      isWidget: {
        default: false,
        parseHTML: (element) => element.hasAttribute("data-is-widget"),
        renderHTML: (attributes) => {
          if (!attributes.isWidget) {
            return {};
          }
          return { "data-is-widget": "" };
        },
      },
      files: {
        default: null,
        parseHTML: (element) => {
          const id = element.getAttribute("data-id");
          if (id) {
            const storedFiles = localStorage.getItem(`sandbox-files-${id}`);
            if (storedFiles) {
              try {
                return JSON.parse(storedFiles);
              } catch (e) {
                console.error("Failed to parse stored sandbox files:", e);
              }
            }
          }
          const filesAttr = element.getAttribute("data-files");
          return filesAttr ? JSON.parse(filesAttr) : templateFiles;
        },
        renderHTML: (attributes) => {
          const files = attributes.files || templateFiles;
          return {
            "data-files": JSON.stringify(files),
          };
        },
      },
      template: {
        default: "react",
        parseHTML: (element) =>
          element.getAttribute("data-template") || "react",
        renderHTML: (attributes) => ({
          "data-template": attributes.template,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "livecodeblock" }];
  },
  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes["data-files"] && HTMLAttributes.id) {
      const storedFiles = localStorage.getItem(
        `sandbox-files-${HTMLAttributes.id}`
      );
      if (storedFiles) {
        HTMLAttributes["data-files"] = storedFiles;
      }
    }

    return [
      "livecodeblock",
      mergeAttributes(HTMLAttributes, { class: "mt-12" }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(EditorSandbox);
  },
});
