import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";

/**
 * Server Component example
 */

type CodeProps = {
  code: string;
  className?: string;
};

export async function Code({ code, className }: CodeProps) {
  const highlightedCode = await highlightCode(code);
  return (
    <section
      dangerouslySetInnerHTML={{
        __html: highlightedCode,
      }}
      className={className}
    />
  );
}

async function highlightCode(code: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
    })
    .use(rehypeStringify)
    .process(code);

  return String(file);
}
