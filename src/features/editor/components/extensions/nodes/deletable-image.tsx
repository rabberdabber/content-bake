import { useEffect, useState } from "react";
import Image from "next/image";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { dynamicBlurDataUrl } from "@/lib/image/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function DeletableImage({ node, deleteNode }: NodeViewProps) {
  const { alt, src, class: className } = node.attrs;
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
      <div className="group relative w-full max-w-[600px] min-h-[500px] max-h-[800px] not-prose">
        <Image
          blurDataURL={blurDataUrl || undefined}
          placeholder={blurDataUrl ? "blur" : undefined}
          className={cn("rounded-md border", className)}
          alt={alt || ""}
          src={src as string}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
          }}
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
    </NodeViewWrapper>
  );
}
