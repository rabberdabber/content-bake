export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Content Bake",
  description: "Bake's Content Management System",
  mainNav: [
    {
      title: "Home",
      href: "/",
      protected: false,
    },
    {
      title: "Posts",
      href: "/posts",
      protected: false,
    },
    {
      title: "Create Post",
      href: "/edit",
      protected: true,
    },
    {
      title: "Sandbox",
      href: "/sandbox",
      protected: false,
    },
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/bereket-assefa-251a79178/",
    github: "https://github.com/rabberdabber",
    portfolio: "https://portfolio.codebake.io",
  },
};
