import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageUploader } from "./image-uploader";

export interface ImageInputOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUploader: {
      setImageUploader: () => ReturnType;
    };
  }
}

const ImageUploaderExtension = Node.create<ImageInputOptions>({
  name: "imageUploader",

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
        tag: 'div[data-type="image-uploader"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "image-uploader" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploader);
  },

  addCommands() {
    return {
      setImageUploader:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});

export default ImageUploaderExtension;
