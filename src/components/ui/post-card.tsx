"use client";

import { dynamicBlurDataUrl } from "@/lib/image/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

interface PostCardProps {
  id: string;
  index: number;
  href: string;
  // header slot can be used for badges, status indicators, or other content
  // that should appear above the media section
  header?: ReactNode;
  media?: ReactNode;
  tag?: ReactNode;
  title?: ReactNode;
  excerpt?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
}

export function PostCard({
  href,
  header,
  media,
  tag,
  title,
  excerpt,
  footer,
  actions,
}: PostCardProps) {
  return (
    <div className="group relative flex flex-col">
      {/* Actions container (e.g. delete button) */}
      {actions && <div className="absolute top-2 right-2 z-10">{actions}</div>}

      <article
        className="group relative flex flex-col bg-card hover:bg-card/50 border border-muted 
        rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full"
      >
        {/* Header slot for badges, status indicators etc */}
        {header}

        {media}

        <div className="flex flex-col flex-1 p-4 space-y-4">
          {tag}
          {title}
          {excerpt}
          {footer}
        </div>

        <Link href={href} className="absolute inset-0">
          <span className="sr-only">View Item</span>
        </Link>
      </article>
    </div>
  );
}

// Slot components for composition
export function PostCardMedia({
  src,
  alt,
  priority = false,
  index,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  index: number;
}) {
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const getBlurDataUrl = async () => {
      const url = await dynamicBlurDataUrl(src);
      setBlurDataUrl(url);
    };
    getBlurDataUrl();
  }, [src]);

  return (
    <div className="relative w-full pt-[40%] overflow-hidden">
      <Image
        src={src ?? `/placeholders/${(index % 7) + 1} .jpg`}
        alt={alt}
        fill
        className="absolute inset-0 object-cover transition-transform duration-300 
          group-hover:scale-105"
        priority={priority}
        blurDataURL={blurDataUrl ?? undefined}
        placeholder={blurDataUrl ? "blur" : undefined}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

export function PostCardTag({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
        {children}
      </span>
    </div>
  );
}

export function PostCardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
      {children}
    </h2>
  );
}

export function PostCardExcerpt({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground line-clamp-3">{children}</p>
  );
}

export function PostCardFooter({
  date,
  actionText = "Read more →",
}: {
  date?: string;
  actionText?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-auto pt-4">
      {date && (
        <time className="text-sm text-muted-foreground">
          {format(new Date(date), "MMMM dd, yyyy")}
        </time>
      )}
      <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        {actionText}
      </span>
    </div>
  );
}
