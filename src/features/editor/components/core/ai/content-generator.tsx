import { Editor, JSONContent } from "@tiptap/react";
import {
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
} from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useContentGeneration } from "@/hooks/ai/use-content-generation";
import BlogPreview from "../../preview/blog-preview";
import json5 from "json5";

interface AIContentGeneratorProps {
  editor: Editor;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  chatId: string;
  handleClose: () => void;
}

export function AIContentGenerator({
  editor,
  open,
  setOpen,
  chatId,
  handleClose,
}: AIContentGeneratorProps) {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useContentGeneration(chatId);

  useEffect(() => {
    const handleOpenDialog = () => setOpen(true);
    window.addEventListener("openAIContentDialog", handleOpenDialog);

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("openAIContentDialog", handleOpenDialog);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClose]);

  useEffect(() => {
    if (completion) {
      const scrollArea = document.getElementById("completion-scroll-area");
      const content = document.getElementById("completion-content");
      if (scrollArea && content) {
        scrollArea.scrollTop = content.scrollHeight;
      }
    }
  }, [completion]);

  const parsedContent = useMemo(() => {
    if (!completion) return null;

    // Split the completion by line numbers (e.g., "1:{}", "2:{}", etc.)
    console.log("completion", completion);
    const jsonStrings = completion.split(/\d+:/);
    console.log("jsonStrings", jsonStrings);
    // Filter out empty strings and try to parse each JSON
    const validJsons = jsonStrings
      .filter((str) => str.trim())
      .map((str) => {
        try {
          return json5.parse(str.trim());
        } catch (e) {
          return null;
        }
      })
      .filter((json) => json !== null);

    console.log("validJsons", validJsons);

    // Return the last valid JSON or null if none found
    return validJsons.length > 0 ? validJsons[validJsons.length - 1] : null;
  }, [completion]);

  const insertContent = useCallback(() => {
    if (!editor) return;
    editor.commands.insertContent(parsedContent);
    handleClose();
  }, [editor, parsedContent, handleClose]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] md:h-[80vh] p-4 md:p-6 flex flex-col gap-4">
        <DialogHeader className="flex-none">
          <DialogTitle>Generate Content with AI</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-none space-y-2">
            <Textarea
              placeholder="What would you like me to write about?"
              value={input}
              onChange={handleInputChange}
              className="min-h-[80px] md:min-h-[100px] resize-none md:resize-y"
              disabled={isLoading}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                className="gap-2"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Icons.loader className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Icons.sparkles className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Generate</span>
                    <span className="sm:hidden">Go</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Content Preview Section */}
          {completion && (
            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
              <ScrollArea className="h-full" id="completion-scroll-area">
                {parsedContent ? (
                  <BlogPreview content={parsedContent} />
                ) : (
                  <div className="p-4">
                    Unable to parse content as valid JSON
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <DialogFooter className="flex-none gap-2 flex-wrap justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 md:h-10"
          >
            Cancel
          </Button>
          {completion && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {}}
                disabled={isLoading}
                className="h-8 md:h-10"
              >
                <span className="hidden sm:inline">Regenerate</span>
                <span className="sm:hidden">Retry</span>
              </Button>
              <Button
                type="button"
                onClick={insertContent}
                className="gap-2 h-8 md:h-10"
                disabled={isLoading}
              >
                <Icons.check className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Insert Content</span>
                <span className="sm:hidden">Insert</span>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
