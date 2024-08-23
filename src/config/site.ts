export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js",
  description: "Bite Sized Blog by bake.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Create blog",
      href: "/edit",
    },
    {
      title: "Sandbox",
      href: "/sandbox",
    },
    {
      title: "Image Upload",
      href: "/image-upload",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};
