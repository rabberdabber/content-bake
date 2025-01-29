"use client";
import Link from "next/link";
import { Pencil, BookOpen, Sparkles, Wrench, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import GlowCard from "@/components/glow-card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      bounce: 0.4,
    },
  },
};

const descriptions = [
  {
    icon: <Pencil className="w-6 h-6 mb-4" />,
    title: "Rich Text Editor",
    description:
      "Write and format your content with our powerful WYSIWYG editor featuring real-time preview and collaborative tools",
  },
  {
    icon: <Sparkles className="w-6 h-6 mb-4" />,
    title: "AI-Powered Creation",
    description:
      "Generate engaging content and stunning images with our AI tools. Transform ideas into polished articles instantly",
  },
  {
    icon: <BookOpen className="w-6 h-6 mb-4" />,
    title: "Content Management",
    description:
      "Create, edit and manage your posts and drafts. Track performance with our intuitive dashboard",
  },
  {
    icon: <Code className="w-6 h-6 mb-4" />,
    title: "Developer Friendly",
    description:
      "Interactive code blocks, live sandboxes, and syntax highlighting for technical content",
  },
  {
    icon: <Wrench className="w-6 h-6 mb-4" />,
    title: "Powerful Tools",
    description:
      "Rich media embedding, customizable layouts, and advanced formatting options to craft perfect posts",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-background to-muted pt-16">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-between text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to Content Bake
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Explore our AI-powered content management system. We&apos;re actively
          adding new features to enhance your content creation experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              <Icons.arrowRight className="w-4 h-4" />
              Login to Get Started
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="gap-2">
              <Icons.pencil className="w-4 h-4" />
              Editor Demo
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="secondary" size="lg" className="gap-2">
              <Icons.bookOpen className="w-4 h-4" />
              Read Posts
            </Button>
          </Link>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-4xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {descriptions.map((feature, i) => (
            <motion.div key={i} variants={item}>
              <GlowCard height="h-[250px]" width="w-full">
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h2 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
