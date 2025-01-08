import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Editor } from "@tiptap/react";
import { aiApi } from "@/lib/api";

interface AIPromptProps {
  editor: Editor | null;
}

export function AIPrompt({ editor }: AIPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!editor || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const stream = await aiApi.generateContent({
        prompt,
        style: "blog post",
        tone: "professional",
        include_code: true,
        include_image: true,
      });

      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const events = text.split("\n\n");

        for (const event of events) {
          if (!event.trim() || !event.startsWith("data: ")) continue;

          const jsonStr = event.replace("data: ", "");
          const data = JSON.parse(jsonStr);

          if (data.status === "generating" && data.node) {
            const node = {
              type: data.node.type,
              attrs: data.node.attrs || {},
              content: data.node.content || [],
            };

            editor.commands.insertContent(node);
          }
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  return (
    <div className="fixed top-[220px] right-6 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4">
      <Textarea
        placeholder="Enter a prompt for AI content generation..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px] resize-none mb-2"
        disabled={isGenerating}
      />
      <Button
        onClick={generateContent}
        disabled={isGenerating || !prompt.trim()}
        className="w-full gap-2"
      >
        {isGenerating ? (
          <>
            <Icons.loader className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Icons.sparkles className="h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>
    </div>
  );
}
