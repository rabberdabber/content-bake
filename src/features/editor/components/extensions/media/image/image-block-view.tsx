import Image from "next/image";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { useCallback, useRef, useState, useEffect } from "react";
import { dynamicBlurDataUrl } from "@/lib/image/utils";

interface ImageBlockViewProps {
  editor: Editor;
  getPos: () => number;
  node: Node;
  deleteNode: () => void;
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
  const { editor, getPos, node, deleteNode } = props as ImageBlockViewProps & {
    node: Node & {
      attrs: {
        src: string;
      };
    };
  };
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { src } = node.attrs;
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlurDataUrl = async () => {
      const url = await dynamicBlurDataUrl(src);
      setBlurDataUrl(url);
    };
    fetchBlurDataUrl();
  }, [src]);

  const wrapperClassName = cn(
    node.attrs.align === "left" ? "ml-0" : "ml-auto",
    node.attrs.align === "right" ? "mr-0" : "mr-auto",
    node.attrs.align === "center" && "mx-auto"
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width: node.attrs.width }}>
        <div
          contentEditable={false}
          ref={imageWrapperRef}
          className="group relative min-h-[500px] not-prose"
        >
          <Image
            src={src}
            alt=""
            onClick={onClick}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="block rounded-md border"
            style={{ objectFit: "cover" }}
            blurDataURL={blurDataUrl || undefined}
            placeholder={blurDataUrl ? "blur" : undefined}
            priority
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 z-10 h-8 w-8",
              "bg-background/80 backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              "hover:bg-destructive hover:text-destructive-foreground"
            )}
            onClick={deleteNode}
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageBlockView;
