import React, { useRef } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";
import LanguageSelector from "../../core/code/language-selector";
import { SupportedLanguage } from "@/types/code";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface CodeBlockProps {
  node: {
    attrs: {
      language: SupportedLanguage;
    };
  };
  updateAttributes: (attrs: { language: SupportedLanguage }) => void;
  deleteNode: () => void;
  extension: {
    options: {
      lowlight: {
        listLanguages: () => SupportedLanguage[];
      };
    };
  };
}

type CodeBlockContentProps = {
  value: SupportedLanguage;
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue: (value: SupportedLanguage) => void;
  defaultLanguage: SupportedLanguage;
  extension: CodeBlockProps["extension"];
  updateAttributes: CodeBlockProps["updateAttributes"];
};

const CodeBlockContent = ({
  value,
  open,
  setOpen,
  setValue,
  defaultLanguage,
  extension,
  updateAttributes,
}: CodeBlockContentProps) => {
  const contentRef = useRef<HTMLPreElement>(null);

  return (
    <>
      <pre
        ref={contentRef}
        className={cn(
          "overflow-x-auto relative max-w-full border border-slate-200 dark:border-slate-700 rounded-md not-prose p-4"
        )}
        spellCheck="false"
      >
        <div className="absolute top-2 right-0 -translate-x-12">
          <LanguageSelector
            value={value}
            open={open}
            setOpen={setOpen}
            setValue={setValue}
            defaultLanguage={defaultLanguage}
            languages={extension.options.lowlight.listLanguages()}
            updateAttributes={updateAttributes}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <NodeViewContent as="code" spellCheck="false" />
      </pre>
    </>
  );
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
  deleteNode,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultLanguage);

  return (
    <NodeViewWrapper>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-4 z-10 h-8 w-8",
            "bg-background/80 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-200",
            "hover:bg-destructive hover:text-destructive-foreground"
          )}
          onClick={deleteNode}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
        <CodeBlockContent
          value={value}
          open={open}
          setOpen={setOpen}
          setValue={setValue}
          defaultLanguage={defaultLanguage}
          extension={extension}
          updateAttributes={updateAttributes}
        />
        <span
          className={cn(
            "absolute bottom-2 right-2 text-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-200",
            "bg-background/80 backdrop-blur-sm",
            "px-2 py-1 rounded-sm"
          )}
        >
          <code className="text-sm p-1 bg-background/80 backdrop-blur-sm">
            ⌘ + Enter
          </code>{" "}
          to exit
        </span>
      </div>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
