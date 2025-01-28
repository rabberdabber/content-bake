import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PostWithContentData } from "@/schemas/post";
import { ReadingTime } from "@/components/reading-time";

type PostHeroProps = {
  data: PostWithContentData;
};

function PostHero({ data }: PostHeroProps) {
  const { title, created_at, feature_image_url, author, tags } = data;
  const humanizedDate = format(new Date(created_at as string), "MMMM do, yyyy");

  return (
    <header
      className={cn(
        "relative w-full max-w-[85rem] mx-auto overflow-hidden bg-dot-black/[0.05] dark:bg-dot-white/[0.05]"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 bg-background/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-3xl mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight tracking-tight animate-in slide-in-from-bottom-2 duration-700">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-2 animate-in slide-in-from-bottom-3 duration-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border shadow-lg ring-2 ring-background">
                <AvatarImage
                  src={author?.image_url || "/avatar.png"}
                  alt={author?.full_name || "Anonymous Author"}
                />
                <AvatarFallback className="bg-secondary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{author?.full_name}</span>
                <span className="text-sm text-muted-foreground">
                  {author?.email}
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block" />

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={created_at as string}>{humanizedDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  <ReadingTime content={data.content} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative w-full max-w-6xl mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-foreground/10">
          <AspectRatio ratio={21 / 9}>
            <div className="absolute inset-0 z-10" />
            <Image
              src={feature_image_url || "/placeholders/1.png"}
              alt={title}
              className="object-cover w-full h-full rounded-lg animate-in fade-in duration-1000"
              fill
              sizes="100vw"
              quality={100}
              priority
            />
          </AspectRatio>
        </div>
      </div>

      {/* Badges */}
      {tags && (
        <div className="relative w-full max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center animate-in slide-in-from-bottom-4 duration-700">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-sm font-medium shadow-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default PostHero;
