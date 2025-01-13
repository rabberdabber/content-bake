import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type PostHeroProps = {
  title: string;
  publishedOn: string;
  className?: string;
  badges?: string[];
  author?: {
    name: string;
    image?: string;
    role?: string;
  };
  readingTime?: string;
  coverImage?: {
    src: string;
    alt: string;
  };
};

function PostHero({
  title,
  publishedOn,
  className,
  badges = ["#1", "#2", "#3"],
  author = {
    name: "John Doe",
    role: "Writer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  readingTime = "5 min read",
  coverImage = {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=80",
    alt: "Code editor showing colorful syntax highlighting",
  },
  ...delegated
}: PostHeroProps) {
  const humanizedDate = format(new Date(publishedOn), "MMMM do, yyyy");

  return (
    <header
      className={cn(
        "relative w-full max-w-[85rem] mx-auto overflow-hidden bg-dot-black/[0.05] dark:bg-dot-white/[0.05]",
        className
      )}
      {...delegated}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 bg-background/80 backdrop-blur-sm" />
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-muted/5 dark:from-primary/10 dark:via-secondary/10 dark:to-muted/10" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-3xl mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight tracking-tight animate-in slide-in-from-bottom-2 duration-700">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-2 animate-in slide-in-from-bottom-3 duration-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border shadow-lg ring-2 ring-background">
                <AvatarImage src={author.image} alt={author.name} />
                <AvatarFallback className="bg-secondary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{author.name}</span>
                <span className="text-sm text-muted-foreground">
                  {author.role}
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block" />

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={publishedOn}>{humanizedDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative w-full max-w-6xl mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-foreground/10">
          <AspectRatio ratio={21 / 9}>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10" />
            <Image
              src={coverImage.src}
              alt={coverImage.alt}
              className="object-cover w-full h-full animate-in fade-in duration-1000"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="relative w-full max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center animate-in slide-in-from-bottom-4 duration-700">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm font-medium bg-background/70 hover:bg-background/90 backdrop-blur-sm transition-colors shadow-sm"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default PostHero;
