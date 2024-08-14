import clsx from "clsx";
import { format } from "date-fns";

type BlogHeroProps = {
  title: string;
  publishedOn: string;
  className?: string;
};

function BlogHero({
  title,
  publishedOn,
  className,
  ...delegated
}: BlogHeroProps) {
  const humanizedDate = format(new Date(publishedOn), "MMMM do, yyyy");

  return (
    <header
      className={clsx(
        "relative flex flex-col justify-end items-center w-full max-w-screen-xl mx-auto",
        className
      )}
      {...delegated}
    >
      <div
        className={clsx(
          "relative w-full max-w-screen-lg px-4 py-12 sm:pt-[calc(48px+8vw)] sm:pb-16"
        )}
      >
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="text-lg text-gray-900 dark:text-gray-600 mb-0 font-normal sm:text-xl text-muted-foreground">
          Published on{" "}
          <time dateTime={publishedOn} className="font-medium">
            {humanizedDate}
          </time>
        </p>
      </div>
    </header>
  );
}

export default BlogHero;
