import { Editor } from "@tiptap/react";
import {
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useRef,
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
import { AIContentPreview } from "../../preview/ai-content-preview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentTone } from "@/types/content-generator";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedTone, setSelectedTone] = useState<ContentTone>("article");
  const {
    parsedContent,
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error: completionError,
  } = useContentGeneration(chatId, selectedTone);

  const handleDialogClose = () => {
    handleClose();
    setOpen(false);
    stop();
  };

  useEffect(() => {
    if (completionError) {
      toast.error(completionError.toString());
    }
  }, [completionError, handleDialogClose]);

  useEffect(() => {
    const handleOpenDialog = () => setOpen(true);
    window.addEventListener("openAIContentDialog", handleOpenDialog);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleDialogClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("openAIContentDialog", handleOpenDialog);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClose, setOpen]);

  const insertContent = useCallback(() => {
    if (!editor || !parsedContent) return;
    editor.commands.insertContent(parsedContent);
    handleClose();
  }, [editor, parsedContent, handleClose]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollTimeout = setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, []);

  useEffect(() => {
    if (completion) {
      scrollToBottom();
    }
  }, [completion, scrollToBottom]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}
    >
      <DialogContent
        className={cn(
          "p-4 md:p-6",
          "max-h-[80vh] md:max-w-[50vw]",
          "overflow-auto m-auto"
        )}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <DialogHeader className="px-4 py-2 md:px-6 md:py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Icons.sparkles className="h-4 w-4 text-primary" />
              Generate Content with AI
            </DialogTitle>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col gap-4 p-4 md:p-6 w-full">
            {/* Input Form */}
            <div className="flex gap-4 items-center">
              <Select
                value={selectedTone}
                onValueChange={(value: ContentTone) => setSelectedTone(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="flex-none space-y-2"
            >
              <Textarea
                placeholder="What would you like me to write about?"
                value={input}
                onChange={handleInputChange}
                className={cn(
                  "min-h-[80px] md:min-h-[100px] resize-none md:resize-y",
                  "focus:ring-1 focus:ring-primary",
                  "placeholder:text-muted-foreground/60"
                )}
                disabled={isLoading}
              />
              <div className="flex justify-end gap-2">
                {isLoading && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={stop}
                    className="gap-2"
                  >
                    <Icons.stop className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Stop</span>
                  </Button>
                )}
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

            {/* Modified Preview Area with animations */}
            <AnimatePresence mode="wait">
              {completion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={cn(
                    "flex-1 min-h-0 overflow-hidden",
                    "transition-opacity duration-200"
                  )}
                >
                  <ScrollArea
                    className="h-full rounded-lg border bg-muted/30"
                    ref={scrollRef}
                  >
                    <motion.div
                      className="p-4"
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AIContentPreview
                        content={parsedContent}
                        editor={editor}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <DialogFooter className="flex-none p-4 md:p-6 border-t gap-2">
            <div className="flex gap-2 w-full justify-between sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9"
              >
                Cancel
              </Button>
              {completion && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleSubmit({ preventDefault: () => {} } as any)
                    }
                    disabled={isLoading}
                    className="h-9 gap-2"
                  >
                    <Icons.refresh className="h-4 w-4" />
                    <span className="hidden sm:inline">Regenerate</span>
                    <span className="sm:hidden">Retry</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={insertContent}
                    className="h-9 gap-2"
                    disabled={isLoading || !parsedContent}
                  >
                    <Icons.check className="h-4 w-4" />
                    <span className="hidden sm:inline">Insert Content</span>
                    <span className="sm:hidden">Insert</span>
                  </Button>
                </div>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
