import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import EmbedInput from "./embed-input";
import { Icons } from "@/components/icons";

const YoutubeInputComponent = ({
  editor,
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) => {
  return (
    <EmbedInput
      type="youtube"
      node={node}
      updateAttributes={updateAttributes}
      deleteNode={deleteNode}
      placeholder="Paste YouTube URL here..."
      icon={<Icons.youtube />}
      onSubmit={(url) => {
        const videoId = url.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/i
        )?.[1];

        if (!videoId) {
          throw new Error("Invalid YouTube URL");
        }

        if (editor) {
          editor
            .chain()
            .focus()
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                // Replace the current node with a youtube node
                tr.replaceWith(
                  tr.selection.from,
                  tr.selection.from + 1,
                  editor.schema.nodes.youtube.create({
                    src: url,
                    width: 480,
                    height: 480,
                  })
                );
              }
              return true;
            })
            .run();
        }
      }}
    />
  );
};

export const YoutubeInput = Node.create({
  name: "youtubeInput",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      url: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="youtube-input"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "youtube-input" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeInputComponent);
  },
});

export default YoutubeInput;
