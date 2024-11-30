import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Video from "@/components/tiptap-extensions/video";
import SandboxExtension from "@/components/tiptap-extensions/sandbox-extension";
import TrailingNodeExtension from "@/components/tiptap-extensions/trailing-node";
import CommandsExtension from "@/components/tiptap-extensions/commands";
import CodeBlock from "@/components/code/tiptap-code-block";
import { TabCommand } from "@/components/tiptap-extensions/tab-command";
import { cn } from "@/lib/utils";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const extensions = [
  GlobalDragHandle,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  CustomTableCell,
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock);
    },
  }).configure({
    lowlight: createLowlight(common),
    languageClassPrefix: "language-",
    HTMLAttributes: {
      class: cn(
        "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"
      ),
      spellcheck: "false",
    },
  }),
  TabCommand,
  SandboxExtension,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: cn("list-disc list-outside leading-3 -mt-2"),
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: cn("list-decimal list-outside leading-3 -mt-2"),
      },
    },
    listItem: {
      HTMLAttributes: {
        class: cn("leading-normal -mb-2"),
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: cn("border-l-4 border-primary"),
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: cn(
          "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"
        ),
      },
    },
    code: {
      HTMLAttributes: {
        class: cn("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  Image.configure({
    HTMLAttributes: {
      class: cn("rounded-md border"),
    },
  }),
  Dropcursor,
  Document,
  TrailingNodeExtension,
  CommandsExtension,
  Placeholder.configure({
    placeholder: "Press '/' for commands",
  }),
  Youtube,
  Video,
];

export default extensions;
