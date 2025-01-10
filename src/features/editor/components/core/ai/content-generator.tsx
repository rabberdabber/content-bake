import { NodeViewWrapper, Editor, NodeViewProps } from "@tiptap/react";
import { useState, useMemo } from "react";
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

type GeneratedNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: GeneratedNode[];
  text?: string;
};

interface PartialContent {
  id: number;
  step: string;
  code: string;
}

export function AIContentGenerator({
  node,
  deleteNode,
  editor,
}: NodeViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useContentGeneration();

  const handleClose = () => {
    setIsOpen(false);
    deleteNode?.();
  };

  const insertContent = () => {
    if (!editor) return;
    editor.commands.insertContent(completion);
    handleClose();
  };

  const mergedCompletion = useMemo(() => {
    if (!completion) return null;

    // Split the string into individual JSON objects and parse them
    const items = completion
      .split("\n")
      .filter(Boolean)
      .map((item) => {
        try {
          // Replace single quotes with double quotes before parsing
          const normalizedJson = item.replace(/'/g, '"');
          return JSON.parse(normalizedJson);
        } catch (e) {
          console.log("Failed to parse:", item);
          return null;
        }
      })
      .filter((item): item is PartialContent => item !== null);

    // Create a Map to store the latest content for each ID
    const contentMap = new Map<number, PartialContent>();
    items.forEach((item) => {
      contentMap.set(item.id, item);
    });

    // Convert Map values back to array and sort by ID
    return Array.from(contentMap.values()).sort((a, b) => a.id - b.id);
  }, [completion]);

  console.log("mergedCompletion", mergedCompletion);
  return (
    <NodeViewWrapper>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <ScrollArea className="h-full">
                  <div className="p-3 md:p-4 lg:p-6">
                    {JSON.stringify(mergedCompletion, null, 2)}
                  </div>
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
    </NodeViewWrapper>
  );
}
