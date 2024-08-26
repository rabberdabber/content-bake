import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import CommandsList from "./command-list";

interface CommandsListRef {
  onKeyDown: (props: any) => boolean;
}

const suggestions = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: "Heading 1",
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        title: "Heading 2",
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        title: "code block",
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("codeBlock", { language: "python" })
            .run();
        },
      },
      {
        title: "live code block",
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent("<live-code-block></live-code-block>")
            .run();
        },
      },
    ]
      .filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 10);
  },

  render: () => {
    let reactRenderer: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: any) => {
        reactRenderer = new ReactRenderer(CommandsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          theme: "light",
          arrow: true,
          maxWidth: "none",
        });
      },

      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return (reactRenderer.ref as CommandsListRef)?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
};

const CommandsExtension = Extension.create({
  name: "commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: any;
        }) => {
          props.command({ editor, range });
        },
        ...suggestions,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default CommandsExtension;
