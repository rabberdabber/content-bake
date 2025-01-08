import { useState } from "react";
import { NodeViewWrapper, Editor } from "@tiptap/react";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateImageWithConfig } from "@/lib/image/utils";
import { cn } from "@/lib/utils";

interface AIImageGeneratorProps {
  node: any;
  deleteNode: () => void;
  editor?: Editor;
}

export function AIImageGenerator({
  node,
  deleteNode,
  editor,
}: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  const replaceWithImage = (imageUrl: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .command(({ tr, dispatch }) => {
          if (dispatch) {
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
      <div className="relative rounded-lg border-2 transition-all bg-white min-h-[400px] h-auto overflow-y-auto">
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generate Image with AI</h3>
              <Button variant="ghost" size="icon" onClick={deleteNode}>
                <Icons.x className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {/* Chat messages section */}
              {chatMessages.length > 0 && (
                <ScrollArea
                  className="w-full rounded-md border p-4"
                  style={{
                    height: `${Math.min(chatMessages.length * 50 + 32, 300)}px`,
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
                    onClick={deleteNode}
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
      </div>
    </NodeViewWrapper>
  );
}
