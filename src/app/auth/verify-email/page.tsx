"use client";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/actions/user";
import { useTransition } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    startTransition(async () => {
      let success = false;
      try {
        await sendVerificationEmail();
        success = true;
      } catch (error) {
        console.error(error);
      } finally {
        if (success) {
          toast.success("Verification email sent");
        } else {
          toast.error("Failed to send verification email");
        }
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center gap-6 bg-muted/50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p>
          A verification link has been sent to your email. Click it to verify
          your account and get full access.
        </p>
        <Button onClick={handleResend} disabled={isPending}>
          {isPending ? "Sending..." : "Resend Verification Email"}
        </Button>
      </div>
    </div>
  );
}
