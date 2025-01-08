import { useEffect, useState } from "react";
import Image from "next/image";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

import { DeletableNodeWrapper } from "../deletable-node-wrapper";
import { cn } from "@/lib/utils";
import { dynamicBlurDataUrl } from "@/lib/image/utils";

export function DeletableImage({ node, deleteNode }: NodeViewProps) {
  const { width, height, alt, src, class: className } = node.attrs;
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlurDataUrl = async () => {
      const url = await dynamicBlurDataUrl(src as string);
      setBlurDataUrl(url);
    };
    fetchBlurDataUrl();
  }, [src]);

  return (
    <NodeViewWrapper>
      <DeletableNodeWrapper
        deleteNode={deleteNode}
        width={width}
        height={height}
      >
        <div className="relative mx-auto my-4" style={{ width, height }}>
          <Image
            blurDataURL={blurDataUrl || undefined}
            placeholder={blurDataUrl ? "blur" : undefined}
            className={cn("rounded-md border", className)}
            alt={alt || ""}
            src={src as string}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            width={width}
            height={height}
            priority
          />
        </div>
      </DeletableNodeWrapper>
    </NodeViewWrapper>
  );
}
