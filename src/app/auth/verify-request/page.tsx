export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center gap-6 bg-muted/50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p>
          A login link will be sent to your email! Use it and you&apos;ll be able
          to access your account.
        </p>
      </div>
    </div>
  );
} 