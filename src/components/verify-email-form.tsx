"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification code is required"),
});

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      token: formData.get("token") as string,
    };

    try {
      const validatedFields = verifyEmailSchema.parse(data);

      // TODO: Implement email verification action
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

      toast.success("Email verified successfully");
      router.push("/auth/signin");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Invalid verification code");
        console.error("Verification error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We sent a verification code to <strong>{email}</strong>
              </>
            ) : (
              "Enter the verification code sent to your email"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="token">Verification Code</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter verification code"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
              <div className="text-center text-sm">
                Didn&apos;t receive the code?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  disabled={isLoading}
                  onClick={async () => {
                    if (!email) return;
                    setIsLoading(true);
                    try {
                      // TODO: Implement resend verification email action
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      toast.success("Verification code resent");
                    } catch (error) {
                      toast.error("Failed to resend verification code");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Resend code
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
