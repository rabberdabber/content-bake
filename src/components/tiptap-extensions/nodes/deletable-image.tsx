import Image from "next/image";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

import { DeletableNodeWrapper } from "../deletable-node-wrapper";
import { cn } from "@/lib/utils";

export function DeletableImage({ node, deleteNode }: NodeViewProps) {
  console.log(typeof node);
  const { width, height, alt, src, class: className } = node.attrs;
  return (
    <NodeViewWrapper>
      <DeletableNodeWrapper
        deleteNode={deleteNode}
        width={width}
        height={height}
      >
        <div className="relative mx-auto my-4" style={{ width, height }}>
          <Image
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
