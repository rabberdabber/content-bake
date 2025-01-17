import { Icons } from "@/components/icons";
import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center gap-6 bg-muted/50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icons.logo className="size-4" />
          </div>
          Bake&apos;s Blogging Platform
        </a>
        <SignUpForm />
      </div>
    </div>
  );
}
