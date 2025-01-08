import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AIContentGenerator } from "./ai-content-generator";

export interface AIContentGeneratorOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiContentGenerator: {
      setAIContentGenerator: () => ReturnType;
    };
  }
}

const AIContentGeneratorExtension = Node.create<AIContentGeneratorOptions>({
  name: "aiContentGenerator",

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
        tag: 'div[data-type="ai-content-generator"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "ai-content-generator" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIContentGenerator);
  },

  addCommands() {
    return {
      setAIContentGenerator:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});

export default AIContentGeneratorExtension; 