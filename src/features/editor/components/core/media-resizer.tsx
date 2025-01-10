import { Editor } from "@tiptap/react";
import Moveable from "react-moveable";

export const MediaResizer = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    console.log("No editor instance");
    return null;
  }

  // if (!editor.isActive("image") && !editor.isActive("youtube")) {
  //   console.log("No image or youtube active");
  //   return null;
  // }

  const domElement = editor.view.dom.querySelector(
    "img.ProseMirror-selectednode"
  ) as HTMLElement;

  if (!domElement) {
    console.log("No DOM element found");
    return null;
  }

  console.log("image resizer", domElement);

  const updateMediaSize = () => {
    if (domElement) {
      const selection = editor.state.selection;
      const width = Number(domElement.style.width.replace("px", ""));
      const height = Number(domElement.style.height.replace("px", ""));

      const setImage = editor.commands.setImage as (options: {
        src: string;
        width: number;
        height: number;
      }) => boolean;

      setImage({
        src: (domElement as HTMLImageElement).src,
        width,
        height,
      });

      editor.commands.setNodeSelection(selection.from);
    }
  };

  return (
    <Moveable
      target={domElement}
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
