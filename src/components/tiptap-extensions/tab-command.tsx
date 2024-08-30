import { Extension } from "@tiptap/core";

export const TabCommand = Extension.create({
  name: "tabHandler",
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Sinks a list item / inserts a tab character
        editor
          .chain()
          .sinkListItem("listItem")
          .command(({ tr }) => {
            tr.insertText("\u0009");
            return true;
          })
          .run();
        // Prevent default behavior (losing focus)
        return true;
      },
    };
  },
});
