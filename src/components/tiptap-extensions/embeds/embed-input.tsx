import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type EmbedType = "youtube" | "vimeo" | "video" | "generic";

interface EmbedInputProps {
  type: EmbedType;
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
  placeholder?: string;
  onSubmit: (url: string) => void;
  icon?: React.ReactNode;
}

const EmbedInput = ({
  type,
  updateAttributes,
  deleteNode,
  placeholder = "Paste URL here...",
  onSubmit,
  icon,
}: EmbedInputProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      onSubmit(url);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid URL");
    }
  };

  return (
    <NodeViewWrapper className="not-prose my-4">
      <div className="flex flex-col gap-2 p-2 border rounded-md bg-background">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full"
          >
            <Input
              type="text"
              placeholder={placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="ghost">
              <Icons.check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => deleteNode()}
            >
              <Icons.x className="h-4 w-4" />
            </Button>
          </form>
        </div>
        {error && <p className="text-sm text-red-500 px-2">{error}</p>}
      </div>
    </NodeViewWrapper>
  );
};

export default EmbedInput;
