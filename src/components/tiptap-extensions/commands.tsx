// import { Extension } from "@tiptap/core";
// import Suggestion from "@tiptap/suggestion";
// import { Editor, Range } from "@tiptap/core";
// import commandSuggestions from "./commands-suggestion";

// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     liveCodeBlock: {
//       /**
//        * Add a live code block
//        */
//       setLiveCodeBlock: (attributes?: {
//         language?: string;
//         isWidget?: boolean;
//       }) => ReturnType;
//     };
//   }
// }

// declare module "@tiptap/core" {
//   interface NodeConfig {
//     "live-code-block": {
//       language: string | null;
//       isWidget: boolean;
//     };
//   }
// }

// const CommandsExtension = Extension.create({
//   name: "commands",

//   addOptions() {
//     return {
//       suggestion: {
//         char: "/",
//         command: ({
//           editor,
//           range,
//           props,
//         }: {
//           editor: Editor;
//           range: Range;
//           props: any;
//         }) => {
//           props.command({ editor, range });
//         },
//         ...commandSuggestions,
//       },
//     };
//   },

//   addProseMirrorPlugins() {
//     return [
//       Suggestion({
//         editor: this.editor,
//         ...this.options.suggestion,
//       }),
//     ];
//   },
// });

// export default CommandsExtension;

import { Extension } from "@tiptap/core";
import { ReactRenderer, type Editor } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance, Props } from "tippy.js";
import { EditorCommandOut } from "@/components/editor_command";
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
