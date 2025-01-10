import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AIImageGenerator } from "../../../core/ai/image-generator";

export interface AIImageGeneratorOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiImageGenerator: {
      setAIImageGenerator: () => ReturnType;
    };
  }
}

const AIImageGeneratorExtension = Node.create<AIImageGeneratorOptions>({
  name: "aiImageGenerator",

  group: "block",

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-image-generator"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "ai-image-generator" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIImageGenerator);
  },

  addCommands() {
    return {
      setAIImageGenerator:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});

export default AIImageGeneratorExtension;
