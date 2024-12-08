import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import EmbedInput from "./embed-input";
import { Icons } from "@/components/icons";
import type { EmbedType } from "./embed-input";

export interface EmbedInputOptions {
  type: EmbedType;
  HTMLAttributes?: Record<string, any>;
  placeholder?: string;
  icon?: React.ReactNode;
  parseUrl: (url: string) => Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embedInput: {
      setEmbed: (options: { type: EmbedType }) => ReturnType;
    };
  }
}

export const EmbedInputExtension = Node.create<EmbedInputOptions>({
  name: "embedInput",

  group: "block",

  atom: true,

  addOptions() {
    return {
      type: "generic" as EmbedType,
      HTMLAttributes: {},
      placeholder: "Paste URL here...",
      icon: null,
      parseUrl: (url: string) => ({ url }),
    };
  },

  addAttributes() {
    return {
      type: {
        default: this.options.type,
      },
      url: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed-input"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "embed-input" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedInput);
  },

  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { type: options.type },
          });
        },
    };
  },
});
