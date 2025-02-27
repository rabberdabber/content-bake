"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "./ui/badge";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCollections } from "@/app/(collections)/collections-context";
import { usePostFilters } from "@/hooks/use-post-filters";
import { shouldRenderSearchAndFilterSection } from "@/lib/utils";

export function ResultsHeader() {
  const { currentCollections, totalCollections } = useCollections();
  const pathname = usePathname();
  const {
    searchQuery,
    currentTag,
    perPage,
    handlePerPageChange,
    getUrlWithoutParam,
  } = usePostFilters(pathname);
  const router = useRouter();
  const { data: session } = useSession();

  const handleCreatePost = () => {
    router.push("/edit");
  };

  if (!shouldRenderSearchAndFilterSection(pathname)) {
    return null;
  }
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {currentCollections.length} of {totalCollections} posts
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Select
                defaultValue={perPage.toString()}
                onValueChange={handlePerPageChange}
              >
                <SelectTrigger className="w-[110px] h-8">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent defaultValue={perPage.toString()}>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="24">24 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(searchQuery || (currentTag && currentTag !== "all")) && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <Link
                      href={getUrlWithoutParam("search")}
                      className="ml-1 hover:text-destructive"
                    >
                      <Icons.x className="h-3 w-3" />
                    </Link>
                  </Badge>
                )}
                {currentTag && currentTag !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Tag: {currentTag}
                    <Link
                      href={getUrlWithoutParam("tag")}
                      className="ml-1 hover:text-destructive"
                    >
                      <Icons.x className="h-3 w-3" />
                    </Link>
                  </Badge>
                )}
              </div>
            )}

            <Button
              className="h-8 gap-2"
              disabled={!session}
              onClick={handleCreatePost}
            >
              {session ? (
                <>
                  <span className="hidden sm:inline">Create Post</span>
                  <span className="sm:hidden">New</span>
                  <Icons.plus className="h-4 w-4" />
                </>
              ) : (
                <span className="hidden sm:inline">Login to create post</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
