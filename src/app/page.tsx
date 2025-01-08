import Link from "next/link";
import { Pencil, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to Your Writing Space
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Create, edit, and share your stories with our powerful and intuitive
          blog editor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/edit">
            <Button size="lg" className="gap-2">
              <Pencil className="w-4 h-4" />
              Start Writing
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="outline" size="lg" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Read Posts
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
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
              icon: <BookOpen className="w-6 h-6 mb-4" />,
              title: "Auto-saving",
              description: "Never lose your work with automatic draft saving",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border bg-card text-card-foreground"
            >
              {feature.icon}
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
