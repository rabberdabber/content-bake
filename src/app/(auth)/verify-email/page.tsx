import { Icons } from "@/components/icons";
import { VerifyEmailForm } from "@/components/verify-email-form";

export default function VerifyEmailPage() {
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
              &ldquo;Security is our top priority. Verify your email to get
              started.&rdquo;
            </p>
            <footer className="text-sm">Security Team</footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 z-10">
          <Icons.logoBackground className="absolute inset-0" />
        </div>
      </div>
      <div className="lg:p-8">
        <VerifyEmailForm />
      </div>
    </div>
  );
}
