import { Editor } from "@tiptap/react";
import Moveable from "react-moveable";

export const MediaResizer = ({ editor }: { editor: Editor | null }) => {
  if (!editor?.isActive("image")) return null;

  const updateMediaSize = () => {
    const mediaElement = document.querySelector(
      ".ProseMirror-selectednode"
    ) as HTMLElement;
    if (mediaElement) {
      const selection = editor.state.selection;
      const isImage = editor.isActive("image");
      const isYoutube = editor.isActive("youtube");

      const width = Number(mediaElement.style.width.replace("px", ""));
      const height = Number(mediaElement.style.height.replace("px", ""));
      console.log(width, height);

      if (isImage) {
        const setImage = editor.commands.setImage as (options: {
          src: string;
          width: number;
          height: number;
        }) => boolean;

        setImage({
          src: (mediaElement as HTMLImageElement).src,
          width,
          height,
        });
      } else if (isYoutube) {
        const setYoutube = editor.commands.setYoutubeVideo as (options: {
          src: string;
          width: number;
          height: number;
        }) => boolean;

        setYoutube({
          src: (mediaElement as HTMLIFrameElement).src,
          width,
          height,
        });
      }

      editor.commands.setNodeSelection(selection.from);
    }
  };

  return (
    <Moveable
      target={
        document.querySelector(".ProseMirror-selectednode") as HTMLElement
      }
      container={null}
      origin={false}
      edge={false}
      throttleDrag={0}
      keepRatio={true}
      resizable={true}
      throttleResize={0}
      onResize={({ target, width, height, delta }) => {
        if (delta[0]) target.style.width = `${width}px`;
        if (delta[1]) target.style.height = `${height}px`;
      }}
      onResizeEnd={() => {
        updateMediaSize();
      }}
      scalable={true}
      throttleScale={0}
      renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
      onScale={({ target, transform }) => {
        target.style.transform = transform;
      }}
    />
  );
};
