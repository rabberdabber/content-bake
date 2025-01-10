import { useState, useRef, useEffect, useCallback } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dynamicBlurDataUrl, generateImageWithConfig } from "@/lib/image/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AIImageGenerator({
  node,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleInsertImage = useCallback(() => {
    if (editor && previewImage) {
      editor
        .chain()
        .setImageBlock({ src: previewImage })
        .deleteRange({ from: getPos(), to: getPos() })
        .focus()
        .run();
      toast.success(`Image inserted successfully.`);
    }
  }, [editor, getPos, previewImage, deleteNode]);

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: aiPrompt }]);
    setIsGenerating(true);

    try {
      const imageUrl = await generateImageWithConfig(aiPrompt);
      if (imageUrl) {
        setPreviewImage(imageUrl);
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Image generated successfully!" },
        ]);
        setBlurDataUrl(await dynamicBlurDataUrl(imageUrl));
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <NodeViewWrapper className="not-prose my-4">
      <div className="relative rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all min-h-[300px] sm:min-h-[400px] h-auto w-full max-w-4xl mx-auto overflow-hidden">
        <Button
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={deleteNode}
        >
          <Icons.x className="h-4 w-4" />
        </Button>
        <div className="w-full h-full p-4 sm:p-6 md:p-8">
          <div className="flex items-center space-y-2 mt-4 gap-2 mb-6 border-2 border-primary rounded-lg p-2">
            <Icons.wand2 className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold tracking-tight">
              Generate Image with AI
            </h3>
          </div>

          <div className="space-y-6">
            {chatMessages.length > 0 && (
              <ScrollArea className="w-full rounded-lg border bg-muted/30 p-4">
                <div
                  className="space-y-3 pr-4"
                  style={{
                    minHeight: "100px",
                    maxHeight: `${Math.min(
                      chatMessages.length * 60 + 40,
                      300
                    )}px`,
                  }}
                >
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-2 rounded-lg p-3 text-sm transition-colors",
                        msg.role === "ai"
                          ? "bg-primary/5 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background">
                        {msg.role === "ai" ? (
                          <Icons.bot className="h-3 w-3" />
                        ) : (
                          <Icons.user className="h-3 w-3" />
                        )}
                      </span>
                      {msg.role === "ai" && previewImage ? (
                        <div className="relative w-32 h-32">
                          <Image
                            src={previewImage}
                            alt="Generated preview"
                            fill
                            className="rounded-lg border object-cover"
                            blurDataURL={blurDataUrl || undefined}
                            placeholder={blurDataUrl ? "blur" : undefined}
                            sizes="128px"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <form onSubmit={handleAIGenerate} className="space-y-4">
              <Textarea
                ref={textareaRef}
                placeholder="Describe the image you want to generate..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[120px] resize-none bg-background/50 backdrop-blur-sm"
                disabled={isGenerating}
              />
              <div className="flex justify-end gap-2">
                {previewImage && (
                  <Button
                    type="button"
                    onClick={handleInsertImage}
                    className="gap-2"
                    variant="secondary"
                  >
                    <Icons.plus className="h-4 w-4" />
                    Insert Image
                  </Button>
                )}
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
    </NodeViewWrapper>
  );
}
