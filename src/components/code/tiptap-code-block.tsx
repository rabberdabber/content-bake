import React, { useEffect, useRef } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";
import CollapsibleWrapper, {
  useCollapsibleWrapper,
} from "./collapsible-wrapper";
import LanguageSelector from "./language-selector";

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "tsx"
  | "jsx"
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "ruby"
  | "go"
  | "rust"
  | "html"
  | "css"
  | "sql"
  | "shell"
  | "markdown"
  | "json"
  | "yaml"
  | "xml"
  | "null"; // for "auto" option

interface CodeBlockProps {
  node: {
    attrs: {
      language: SupportedLanguage;
    };
  };
  updateAttributes: (attrs: { language: SupportedLanguage }) => void;
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
  const { isExpanded, setIsOverflowing, maxHeight } = useCollapsibleWrapper();
  const contentRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [maxHeight]);

  return (
    <>
      <pre
        ref={contentRef}
        className={cn(
          "relative overflow-x-auto",
          !isExpanded && "max-h-[400px] overflow-hidden"
        )}
        spellCheck="false"
      >
        <div className="absolute top-2 right-2">
          <LanguageSelector
            value={value}
            open={open}
            setOpen={setOpen}
            setValue={setValue}
            defaultLanguage={defaultLanguage}
            languages={extension.options.lowlight.listLanguages()}
            updateAttributes={updateAttributes}
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
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultLanguage);

  return (
    <NodeViewWrapper className="relative max-w-full">
      <CollapsibleWrapper maxHeight={400}>
        <CodeBlockContent
          value={value}
          open={open}
          setOpen={setOpen}
          setValue={setValue}
          defaultLanguage={defaultLanguage}
          extension={extension}
          updateAttributes={updateAttributes}
        />
      </CollapsibleWrapper>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
