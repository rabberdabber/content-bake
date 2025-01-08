import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Color } from "@tiptap/extension-color";
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
import YoutubeInput from "@/components/tiptap-extensions/embeds/youtube-input-extension";
import ImageInput from "@/components/tiptap-extensions/image/image-uploader-extension";
import AIImageGeneratorExtension from "@/components/tiptap-extensions/ai-image/ai-image-extension";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import { CustomFocus } from "@/components/tiptap-extensions/custom-focus";
import { CustomDocument } from "@/components/tiptap-extensions/custom-document";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import { DeletableImage } from "@/components/tiptap-extensions/nodes/deletable-image";
import { DeletableTable } from "@/components/tiptap-extensions/nodes/deletable-table";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AIContentGeneratorExtension from "@/components/tiptap-extensions/ai-content/ai-content-extension";

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
  Table.extend({
    addNodeView() {
      return ReactNodeViewRenderer(DeletableTable);
    },
  }).configure({
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
    codeBlock: false,
    dropcursor: false,
    code: {
      HTMLAttributes: {
        class: cn("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    gapcursor: false,
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: ({
          level,
          HTMLAttributes,
        }: {
          level: 1 | 2 | 3;
          HTMLAttributes?: Record<string, any>;
        }) => {
          switch (level) {
            case 1:
              return cn(
                "text-4xl font-bold tracking-tight",
                HTMLAttributes?.class
              );
            case 2:
              return cn(
                "text-3xl font-semibold tracking-tight",
                HTMLAttributes?.class
              );
            case 3:
              return cn(
                "text-2xl font-semibold tracking-tight",
                HTMLAttributes?.class
              );
            default:
              return HTMLAttributes?.class || "";
          }
        },
      },
    },
  }),
  CustomDocument.configure({
    defaultType: "heading",
    defaultLevel: 1,
  }),
  Image.extend({
    group: "block",
    addNodeView() {
      return ReactNodeViewRenderer(DeletableImage);
    },
    HTMLAttributes: {
      class: cn("rounded-md border"),
    },
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: DEFAULT_IMAGE_GENERATION_CONFIG.width,
        },
        height: {
          default: DEFAULT_IMAGE_GENERATION_CONFIG.height,
        },
      };
    },
  }),
  Dropcursor,
  TrailingNodeExtension,
  CommandsExtension,
  Placeholder.configure({
    placeholder: ({ node, pos, editor }) => {
      // Special placeholder for the first (title) node
      if (pos === 0) {
        // If it's not already a heading, make it one
        if (!editor.isActive("heading", { level: 1 })) {
          editor
            .chain()
            .focus()
            .setNode("heading", {
              level: 1,
              HTMLAttributes: {
                class: cn("text-center border-blue-500"),
              },
            })
            .run();
        }
        return "Enter title...";
      }

      // Only show placeholder for empty paragraph nodes
      if (node.type.name === "paragraph") {
        return "Press '/' for commands";
      }

      return "";
    },
    showOnlyCurrent: true,
  }),
  Youtube.configure({
    allowFullscreen: true,
    HTMLAttributes: {
      class:
        "relative w-full aspect-video my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800",
    },
  }),
  Video.configure({
    HTMLAttributes: {
      class: cn(
        "relative w-full aspect-video my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
      ),
      style: {
        width: DEFAULT_IMAGE_GENERATION_CONFIG.width,
        height: DEFAULT_IMAGE_GENERATION_CONFIG.height,
      },
    },
  }),
  CustomFocus.configure({
    className: cn("rounded shadow-[0_0_0_2px_green]"),
    mode: "deepest",
    width: DEFAULT_IMAGE_GENERATION_CONFIG.width,
    height: DEFAULT_IMAGE_GENERATION_CONFIG.height,
  }),
  YoutubeInput,
  ImageInput,
  AIImageGeneratorExtension,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
  AIContentGeneratorExtension,
];

export default extensions;
