"use client";
import Link from "next/link";
import { Pencil, BookOpen, Sparkles, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import GlowCard from "@/components/glow-card";
import { motion } from "framer-motion";

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

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-8rem)] bg-gradient-to-b from-background to-muted pt-16">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-between text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to Content Bake
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Explore our AI-powered post editor.
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
          {[
            {
              icon: <Pencil className="w-6 h-6 mb-4" />,
              title: "Rich Text Editor",
              description:
                "Write and format your content with our powerful WYSIWYG editor",
            },
            {
              icon: <Sparkles className="w-6 h-6 mb-4" />,
              title: "Real-time Preview",
              description:
                "See how your blog post will look as you write with live preview",
            },
            {
              icon: <Wrench className="w-6 h-6 mb-4" />,
              title: "Tools to build your post",
              description: "Many components to build your post",
            },
          ].map((feature, i) => (
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
