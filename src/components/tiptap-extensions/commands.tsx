import { Extension } from "@tiptap/core";
import { type Editor } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import commandSuggestions from "./commands-suggestion";

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
        ...commandSuggestions,
      },
    };
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

export default CommandExtension;
