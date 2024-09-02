import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import CommandsList from "./command-list";
import { Icons } from "@/components/icons";
import { Editor, Range } from "@tiptap/core";

interface CommandsListRef {
  onKeyDown: (props: any) => boolean;
}

const suggestions = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: "Heading 1",
        icon: <Icons.Heading1 />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
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
        icon: <Icons.Heading2 />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
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
        icon: <Icons.code />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("codeBlock", { language: "typescript" })
            .run();
        },
      },
      {
        title: "live code block",
        icon: <Icons.codePen />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent("<live-code-block></live-code-block>")
            .run();
        },
      },
      {
        title: "Image",
        icon: <Icons.image />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.view.dom.dispatchEvent(
            new CustomEvent("openImageDialog", {
              bubbles: true,
              cancelable: true,
            })
          );
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
          theme: "dark",
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
        } else if (props.event.key === "Enter") {
          (reactRenderer.ref as CommandsListRef)?.onKeyDown(props);
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
          editor: Editor;
          range: Range;
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
