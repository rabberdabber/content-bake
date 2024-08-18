import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import matter from "gray-matter";

export async function processMDX(content: string) {
  const { data, content: mdxContent } = matter(content);

  const mdxSource = await serialize(mdxContent, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, { theme: "one-dark-pro", keepBackground: false }],
      ],
      format: "mdx",
    },
  });

  return {
    ...mdxSource,
    frontMatter: data,
  };
}
