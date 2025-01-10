import { useState, useRef, useEffect, useCallback } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateImageWithConfig } from "@/lib/image/utils";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const replaceWithImage = useCallback(
    (imageUrl: string) => {
      if (editor) {
        editor
          .chain()
          .setImageBlock({ src: imageUrl })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
        toast.success(`Image generated successfully.`);
      }
    },
    [editor, getPos]
  );

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

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
                      <div className="flex-1">
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
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
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="gap-2 w-full sm:w-auto"
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
