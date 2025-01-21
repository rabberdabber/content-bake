"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateImageWithConfig } from "@/lib/image/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureImageGeneratorProps {
  onImageGenerated: (url: string) => void;
}

export function FeatureImageGenerator({
  onImageGenerated,
}: FeatureImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: aiPrompt }]);
    setIsGenerating(true);

    try {
      const imageUrl = await generateImageWithConfig(aiPrompt);
      if (imageUrl) {
        setPreviewImage(imageUrl);
        onImageGenerated(imageUrl);
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Image generated successfully!" },
        ]);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {chatMessages.length > 0 && (
        <ScrollArea className="w-full rounded-lg border bg-muted/30 p-4">
          <div
            className="space-y-3 pr-4"
            style={{ minHeight: "100px", maxHeight: "200px" }}
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
          placeholder="Describe the feature image you want to generate..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="min-h-[100px] resize-none bg-background/50 backdrop-blur-sm"
          disabled={isGenerating}
        />
        <Button
          type="submit"
          className="w-full gap-2"
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
      </form>
    </div>
  );
}
