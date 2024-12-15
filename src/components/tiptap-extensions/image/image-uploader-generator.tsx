import { NodeViewWrapper, Editor } from "@tiptap/react";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateImageWithConfig, uploadImage } from "@/lib/image/utils";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageComponentProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
  editor?: Editor;
}

export function ImageComponent({
  node,
  updateAttributes,
  deleteNode,
  editor,
}: ImageComponentProps) {
  const [mode, setMode] = useState<"upload" | "ai" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const getImageUrl = async (image: File | Blob) => {
    let imageUrl: string | null = null;
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {}
    return imageUrl;
  };

  const replaceWithImage = (imageUrl: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .command(({ tr, dispatch }) => {
          if (dispatch) {
            // Replace the current node with an image node
            tr.replaceWith(
              tr.selection.from,
              tr.selection.from + 1,
              editor.schema.nodes.image.create({
                src: imageUrl,
                alt: "Generated image",
                width: DEFAULT_IMAGE_GENERATION_CONFIG.width,
                height: DEFAULT_IMAGE_GENERATION_CONFIG.height,
              })
            );
          }
          return true;
        })
        .run();
      deleteNode?.();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      console.log(`uploading image ${e.target.files[0].name}`);
      try {
        const imageUrl = await getImageUrl(e.target.files[0]);
        if (imageUrl) {
          replaceWithImage(imageUrl);
        }
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const imageUrl = await getImageUrl(e.dataTransfer.files[0]);
      if (imageUrl) {
        replaceWithImage(imageUrl);
      }
    }
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: aiPrompt }]);
    setIsGenerating(true);

    try {
      const imageUrl = await generateImageWithConfig(aiPrompt);
      if (imageUrl) {
        replaceWithImage(imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <NodeViewWrapper className="not-prose my-4">
      <div
        className={cn(
          "relative rounded-lg border-2 transition-all bg-white",
          "min-h-[350px] h-auto",
          dragActive
            ? "border-primary border-dashed bg-muted/50"
            : "border-muted",
          mode === "ai" && "ring-2 ring-primary ring-offset-2"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!mode && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <Icons.imageIcon className="h-10 w-10 text-muted-foreground hover:scale-[1.2] transition-all" />
              <p className="text-sm text-muted-foreground">
                Click to select an image
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("ai");
                }}
              >
                <Icons.sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
            </div>
          </div>
        )}

        {mode === "ai" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Generate Image with AI
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMode(null)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {chatMessages.length > 0 && (
                  <ScrollArea
                    className="w-full rounded-md border p-4"
                    style={{
                      height: `${Math.min(
                        chatMessages.length * 50 + 32,
                        300
                      )}px`,
                    }}
                  >
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={cn(
                          "mb-2 p-2 rounded text-sm",
                          msg.role === "ai"
                            ? "bg-blue-50/50 text-blue-600/70"
                            : "bg-green-50/50 text-green-600/70"
                        )}
                      >
                        <span className="font-medium text-xs uppercase tracking-wide opacity-50 mr-2">
                          {msg.role === "ai" ? "AI" : "You"}:
                        </span>
                        {msg.content}
                      </div>
                    ))}
                  </ScrollArea>
                )}
                <form onSubmit={handleAIGenerate} className="space-y-4">
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[100px] resize-y"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMode(null)}
                      disabled={isGenerating}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={isGenerating || !aiPrompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Icons.loader className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Icons.sparkles className="h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>
    </NodeViewWrapper>
  );
}
