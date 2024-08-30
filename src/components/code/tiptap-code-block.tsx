import React from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

type SupportedLanguage =
  | "javascript"
  | "typescript"
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

const CodeBlock: React.FC<CodeBlockProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper className="relative max-w-[600px]">
      <div className="absolute top-0 right-0 translate-y-1 -translate-x-1">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="float-right">
            <Button className="text-sm font-bold" variant="ghost">
              <span>
                {defaultLanguage === "null" ? "auto" : defaultLanguage}
              </span>
              <Icons.chevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn("overflow-y-auto", "max-h-[300px]")}
          >
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {extension.options.lowlight.listLanguages().map((lang, index) => (
              <DropdownMenuItem
                key={index}
                onSelect={() =>
                  updateAttributes({ language: lang as SupportedLanguage })
                }
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
