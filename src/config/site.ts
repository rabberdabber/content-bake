export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bake's CMS",
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
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/bereket-assefa-251a79178/",
    github: "https://github.com/rabberdabber",
  },
};
