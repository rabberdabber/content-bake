import { useState, useCallback, useEffect } from "react";
import { useCompletion } from "ai/react";
import json5 from "json5";
import { JSONContent } from "@tiptap/react";
import { validateSchema } from "@/lib/utils";
import extensions from "@/features/editor/components/extensions";
import { useDebouncedValue } from "@mantine/hooks";
import { ContentTone } from "@/types/content-generator";
import { toast } from "sonner";

export function useContentGeneration(id: string, tone: ContentTone) {
  // Track both last valid and current parsing content
  const [lastValidContent, setLastValidContent] = useState<JSONContent | null>(
    null
  );
  const [parsingError, setParsingError] = useState<string | null>(null);

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error: completionError,
    stop,
  } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-draft-content?tone=${tone}`,
    headers: {
      Accept: "text/event-stream",
    },
    streamProtocol: "text",
    id,
  });

  // Parse the completion string into JSON content
  const parseCompletion = useCallback((completionText: string) => {
    try {
      if (!completionText) {
        setParsingError(null);
        return null;
      }

      // Split by newlines and get all non-empty lines
      const lines = completionText.split("\n").filter((line) => line.trim());
      let lastValidLine = null;
      let parseError = null;

      for (const line of lines) {
        try {
          const parsed = json5.parse(line);
          if (!parsed.done && !parsed.error && parsed.type === "doc") {
            lastValidLine = line;
          }
        } catch (e) {
          parseError = e;
          continue;
        }
      }

      if (!lastValidLine) {
        setParsingError("No valid content found in the response");
        return null;
      }

      const content = json5.parse<JSONContent>(lastValidLine);

      // Process code blocks to fix newlines
      if (content.content) {
        content.content.forEach((node) => {
          if (node.type === "codeBlock" && Array.isArray(node.content)) {
            node.content.forEach((textNode) => {
              if (textNode.type === "text") {
                textNode.text = textNode.text?.replace(/\\n/g, "\n");
              }
            });
          }
        });
      }

      // Validate the schema
      console.log(
        "failed schema validation forcontent",
        JSON.stringify(content, null, 2)
      );
      try {
        validateSchema(content, extensions);
      } catch (e) {
        console.error("Content failed schema validation", e);
        return null;
      }

      setParsingError(null);
      return content;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown parsing error";
      setParsingError(errorMessage);
      console.error("Error parsing content:", e);
      return null;
    }
  }, []);

  // Use a shorter debounce time for better responsiveness
  const [debouncedCompletion] = useDebouncedValue(completion, 150);

  // Update lastValidContent when we have a valid parsed content
  useEffect(() => {
    const parsedContent = parseCompletion(debouncedCompletion);
    if (parsedContent) {
      setLastValidContent(parsedContent);
    }
  }, [debouncedCompletion, parseCompletion]);

  if (!isLoading && !lastValidContent && completion) {
    toast.error("Failed to generate content");
  }

  return {
    parsedContent: lastValidContent,
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error: completionError || parsingError,
    stop,
  };
}
