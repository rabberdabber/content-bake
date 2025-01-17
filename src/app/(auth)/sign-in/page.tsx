import { Icons } from "@/components/icons";

export default function SignInPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" /> Your App Name
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This app has completely transformed how we handle our
              workflow.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 z-10">
          <Icons.logoBackground className="absolute inset-0" />
        </div>
      </div>
      <div className="lg:p-8">{/* Your sign-in form content */}</div>
    </div>
  );
}
