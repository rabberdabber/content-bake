import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";

// Define a union type of supported languages
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
}) => (
  <NodeViewWrapper className="pr-8 appearance-none cursor-pointer border border-slates-600 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        updateAttributes({ language: event.target.value as SupportedLanguage })
      }
      className="float-right"
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
);

export default CodeBlock;
