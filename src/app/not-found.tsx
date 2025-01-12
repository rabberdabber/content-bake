import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center gap-6 p-4">
      {/* Container with a subtle gradient background */}
      <div className="relative w-full max-w-[600px] mx-auto flex flex-col items-center justify-center gap-6 text-center rounded-lg border bg-gradient-to-b from-background to-muted p-8">
        {/* Large decorative icon */}
        <div className="rounded-full bg-muted p-4 ring-2 ring-muted">
          <Icons.fileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404 Not Found
          </h1>
          <p className="max-w-[400px] text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        {/* Action button */}
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>

        {/* Decorative elements */}
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
        <div className="absolute left-0 -top-1/2 -z-10 h-1/2 w-full bg-gradient-to-b from-background/0 to-background blur-2xl" />
      </div>
    </div>
  );
}
