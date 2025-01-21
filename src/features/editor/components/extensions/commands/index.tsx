import { Extension } from "@tiptap/core";
import { type Editor } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { suggestions } from "@/features/editor/components/commands";

export const TabCommand = Extension.create({
  name: "tabHandler",
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Check if we're in a table cell
        if (editor.isActive("tableCell") || editor.isActive("tableHeader")) {
          // Use the default table navigation
          return false;
        }

        // Handle other cases (lists, tab characters)
        editor
          .chain()
          .focus()
          .sinkListItem("listItem")
          .command(({ tr }) => {
            tr.insertText("\u0009");
            return true;
          })
          .run();

        return true;
      },
    };
  },
});

const CommandExtension = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
          editor.commands.focus();
        },
        ...suggestions,
      },
    };
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

export default CommandExtension;
