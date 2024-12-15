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
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/bereket-assefa-251a79178/",
    github: "https://github.com/rabberdabber",
  },
};
