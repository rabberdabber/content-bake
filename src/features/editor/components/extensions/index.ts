import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Color } from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";

import { ReactNodeViewRenderer } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Video from "./media/video";
import SandboxExtension from "./sandbox/sandbox-extension";
import TrailingNodeExtension from "./nodes/trailing-node";
import CommandsExtension from "./commands";
import CodeBlock from "./code";
import { TabCommand } from "./commands";
import YoutubeInput from "./embeds/youtube-input-extension";
import AIImageGeneratorExtension from "./ai/image";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import { CustomFocus } from "./nodes/custom-focus";
import { Document } from "@tiptap/extension-document";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import { Table, TableCell, TableHeader, TableRow } from "./table";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import ImageBlockView from "./media/image/image-block";
import MediaUploaderExtension from "./media/media-uploader-extension";

const extensions = [
  Table,
  TableHeader,
  TableRow,
  TableCell,
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock);
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          return this.editor.commands.exitCode();
        },
        Enter: ({ editor }) => {
          // If we're at the end of the code block
          if (
            editor.state.selection.$anchor.parentOffset ===
            editor.state.selection.$anchor.parent.content.size
          ) {
            // Insert a newline instead of exiting
            return editor.commands.insertContent("\n");
          }
          return false; // Let TipTap handle normal Enter behavior
        },
      };
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
    document: false,
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
              return cn("font-bold tracking-tight", HTMLAttributes?.class);
            case 2:
              return cn("font-semibold tracking-tight", HTMLAttributes?.class);
            case 3:
              return cn("font-semibold tracking-tight", HTMLAttributes?.class);
            default:
              return HTMLAttributes?.class || "";
          }
        },
      },
    },
  }),
  Document,
  Dropcursor,
  TrailingNodeExtension,
  CommandsExtension,
  Placeholder.configure({
    placeholder: ({ node, pos, editor }) => {
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
  YoutubeInput,
  AIImageGeneratorExtension,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
  // AIContentGeneratorExtension,
  ImageBlockView,
  MediaUploaderExtension,
];

export default extensions;
