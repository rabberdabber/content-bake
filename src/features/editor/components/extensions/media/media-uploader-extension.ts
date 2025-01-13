import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaUploader } from "./media-uploader";
import type { MediaType } from "./types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mediaUploader: {
      setMediaUploader: (options: { type: MediaType }) => ReturnType;
    };
  }
}

export const MediaUploaderExtension = Node.create({
  name: "mediaUploader",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      type: {
        default: "image",
        parseHTML: (element) => element.getAttribute("data-media-type"),
        renderHTML: (attributes) => ({
          "data-media-type": attributes.type,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="media-uploader"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "media-uploader" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaUploader);
  },

  addCommands() {
    return {
      setMediaUploader:
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

export default MediaUploaderExtension;
