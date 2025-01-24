import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { FOCUS_ALLOWED_NODES } from "@/config/focus-nodes";

export interface FocusOptions {
  className: string;
  mode: "deepest" | "shallowest" | "all";
}

export const CustomFocus = Extension.create<FocusOptions>({
  name: "customFocus",

  addOptions() {
    return {
      className: "has-focus",
      mode: "shallowest",
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customFocus"),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }

            let maxLevels = 0;
            if (this.options.mode === "deepest") {
              doc.descendants((node, pos) => {
                if (
                  node.isText ||
                  !FOCUS_ALLOWED_NODES.includes(node.type.name)
                ) {
                  return;
                }
                const isCurrent =
                  anchor >= pos && anchor <= pos + node.nodeSize - 1;
                if (!isCurrent) {
                  return false;
                }
                maxLevels += 1;
              });
            }

            let currentLevel = 0;
            doc.descendants((node, pos) => {
              // Skip if node type is not in allowed list
              if (
                node.isText ||
                !FOCUS_ALLOWED_NODES.includes(node.type.name)
              ) {
                return false;
              }

              const isCurrent =
                anchor >= pos && anchor <= pos + node.nodeSize - 1;
              if (!isCurrent) {
                return false;
              }

              currentLevel += 1;
              const outOfScope =
                (this.options.mode === "deepest" &&
                  maxLevels - currentLevel > 0) ||
                (this.options.mode === "shallowest" && currentLevel > 1);

              if (outOfScope) {
                return this.options.mode === "deepest";
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className,
                  // style: `min-width: ${DEFAULT_IMAGE_GENERATION_CONFIG.width}px; min-height: ${DEFAULT_IMAGE_GENERATION_CONFIG.height}px;`,
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
