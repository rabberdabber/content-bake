import "@/app/mdx.css";
import { Metadata } from "next";
import { loadBlogPost } from "@/file-helper";
import { MDXRemote } from "next-mdx-remote/rsc";

import BlogHero from "@/components/blog-hero";

import { mdxRemoteComponents, mdxRemoteOptions } from "@/config/mdx";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const { frontmatter } = await loadBlogPost(slug);
  if (!frontmatter) {
    return {};
  }

  return {
    title: frontmatter.title,
    description: frontmatter.abstract,
  };
}

const Page = async ({ params: { slug } }: PageProps) => {
  const { frontmatter, content } = await loadBlogPost(slug);
  const { title, publishedOn } = frontmatter;

  return (
    <div className="flex flex-col pb-16 relative z-20 gap-4">
      <BlogHero title={title} publishedOn={publishedOn} />
      <article>
        <div
          className="
        relative 
        grid 
        grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] 
        max-w-[80rem] 
        mx-auto 
        p-16 
        sm:p-16 
        pb-8 
        bg-page-background-light dark:bg-page-background-dark
        shadow-page-light dark:shadow-page-dark
        sm:border
        sm:border-page-border-light dark:border-page-border-dark
        sm:rounded-lg
      "
        >
          <MDXRemote
            source={content}
            components={mdxRemoteComponents}
            options={mdxRemoteOptions}
          />
        </div>
      </article>
    </div>
  );
};

export default Page;
