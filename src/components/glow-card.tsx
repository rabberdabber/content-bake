import React from "react";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card width
   */
  width?: string;
  /**
   * Card height
   */
  height?: string;
  /**
   * Children elements
   */
  children: React.ReactNode;
  /**
   * Optional gradient style override
   */
  gradientClassName?: string;
}

export default function GlowCard({
  width = "w-56",
  height = "h-64",
  children,
  className,
  gradientClassName,
  ...props
}: GlowCardProps) {
  const defaultGradient =
    "from-blue-500 via-teal-400 to-cyan-500 dark:from-blue-600 dark:via-teal-500 dark:to-cyan-600";
  const gradientClasses = gradientClassName || defaultGradient;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-r p-0.5 hover:shadow-glow hover:brightness-150 ${gradientClasses}`}
      style={{
        transition: "box-shadow 0.5s ease",
      }}
      {...props}
    >
      <div
        className={`blur-20 inset-0 h-full w-full rounded-3xl bg-gradient-to-r ${gradientClasses}`}
        style={{
          transition: "filter 0.5s ease",
        }}
      />
      <div
        className={`flex flex-col gap-2 rounded-3xl bg-card p-4 ${width} ${height} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
