import React from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CollapsibleWrapper, {
  useCollapsibleWrapper,
} from "./collapsible-wrapper";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SupportedLanguage =
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
  const { isExpanded } = useCollapsibleWrapper();

  return (
    <>
      <div className="absolute top-0 right-0 translate-y-full -translate-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[min-content]"
            >
              {value
                ? extension.options.lowlight
                    .listLanguages()
                    .find((lang) => lang === value)
                    ?.charAt(0)
                    .toUpperCase() + value.slice(1)
                : "Select Language..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search Language..." />
              <CommandList>
                <CommandEmpty>No Language found.</CommandEmpty>
                <CommandGroup>
                  {extension.options.lowlight
                    .listLanguages()
                    .map((lang, index) => (
                      <CommandItem
                        key={index}
                        value={lang}
                        onSelect={(currentValue) => {
                          updateAttributes({ language: lang });
                          setValue(lang);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            defaultLanguage === lang
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <pre
        className={cn(
          "overflow-x-auto",
          !isExpanded && "max-h-[400px] overflow-hidden"
        )}
        spellCheck="false"
      >
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
