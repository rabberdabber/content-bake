import type { ReactNode, RefObject } from "react";
import { Icons } from "@/components/icons";
import { Editor, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance, Props, type GetReferenceClientRect } from "tippy.js";
import { EditorCommandOut } from "../editor_command";

export const tableHTML = `
  <table style="width:100%">
    <tr>
      <th>Firstname</th>
      <th>Lastname</th>
      <th>Age</th>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Smith</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Eve</td>
      <td>Jackson</td>
      <td>94</td>
    </tr>
    <tr>
      <td>John</td>
      <td>Doe</td>
      <td>80</td>
    </tr>
  </table>
`;

export const suggestions = {
  items: ({ query }: { query: string }) => {
    const commandGroups = [
      {
        heading: "Text Formatting",
        items: [
          {
            key: "heading1",
            title: "Heading 1",
            description: "Large section heading",
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
            key: "heading2",
            title: "Heading 2",
            description: "Medium section heading",
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
        ],
      },
      {
        heading: "Code & Development",
        items: [
          {
            key: "codeBlock",
            title: "Code Block",
            description: "Add a block of code",
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
            key: "liveCodeBlock",
            title: "Live Code Block",
            description: "Add an interactive code block",
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
            key: "widget",
            title: "Widget",
            description: "Insert an interactive widget",
            icon: <Icons.widget />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "live-code-block",
                  attrs: {
                    language: "javascript",
                    isWidget: true,
                  },
                  content: [],
                })
                .run();
            },
          },
        ],
      },
      {
        heading: "Media",
        items: [
          {
            key: "image",
            title: "Image",
            description: "Upload and insert an image",
            icon: <Icons.image />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor.commands.deleteRange(range);
              editor.view.dom.dispatchEvent(
                new CustomEvent("openImageDialog", {
                  bubbles: true,
                  cancelable: true,
                })
              );
            },
          },
          {
            key: "youtube",
            title: "YouTube",
            description: "Embed a YouTube video",
            icon: <Icons.youtube />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "youtubeInput",
                })
                .run();
            },
          },
          {
            key: "video",
            title: "Video",
            description: "Upload and embed a video",
            icon: <Icons.video />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor.commands.deleteRange(range);
              editor.view.dom.dispatchEvent(
                new CustomEvent("openVideoDialog", {
                  bubbles: true,
                  cancelable: true,
                })
              );
            },
          },
        ],
      },
      {
        heading: "Other",
        items: [
          {
            key: "table",
            title: "Table",
            description: "Insert a table",
            icon: <Icons.Table />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent(tableHTML, {
                  parseOptions: {
                    preserveWhitespace: false,
                  },
                })
                .run();
            },
          },
        ],
      },
    ];

    // Filter based on query
    const filteredGroups = commandGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);

    return filteredGroups;
  },

  render: (elementRef?: RefObject<Element> | null) => {
    let component: ReactRenderer | null = null;
    let popup: Instance<Props>[] | null = null;

    return {
      onStart: (props: {
        editor: Editor;
        clientRect: DOMRect;
        range: Range;
      }) => {
        const popupContainer = document.createElement("div");
        popupContainer.id = "slash-command";
        component = new ReactRenderer(EditorCommandOut, {
          props: {
            ...props,
            popupContainer,
          },
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        const { selection } = props.editor.state;

        const parentNode = selection.$from.node(selection.$from.depth);
        const blockType = parentNode.type.name;

        if (blockType === "codeBlock") {
          return false;
        }

        // @ts-ignore
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => (elementRef ? elementRef.current : document.body),
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "top-start",
        });
      },
      onUpdate: (props: {
        editor: Editor;
        clientRect: GetReferenceClientRect;
      }) => {
        component?.updateProps(props);

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();
          return true;
        }

        // @ts-ignore
        return component?.ref?.onKeyDown(props.event);
      },
      onExit: () => {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
};

export interface SuggestionItem {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}

export const createSuggestionItems = (items: SuggestionItem[]) => items;

export const handleCommandNavigation = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    const slashCommand = document.querySelector("#slash-command");
    if (slashCommand) {
      return true;
    }
  }
};

export default suggestions;
