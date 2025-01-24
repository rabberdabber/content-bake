"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import { Separator } from "./ui/separator";

const tags = ["all", "tech", "life", "code", "travel"] as const;

export function SearchAndFilterSection({
  searchQuery,
  currentTag,
  handleSearch,
  handleTagChange,
}: {
  searchQuery: string | null;
  currentTag: string | null;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  handleTagChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Icons.search className="z-40 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                name="search"
                defaultValue={searchQuery || ""}
                className="pl-10 pr-16 w-full bg-background/60 backdrop-blur-sm"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-primary hover:text-primary-foreground"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="flex gap-2">
            <Select
              defaultValue={currentTag || "all"}
              onValueChange={handleTagChange}
            >
              <SelectTrigger className="w-[160px] bg-background/60 backdrop-blur-sm">
                <Icons.filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/60 backdrop-blur-sm"
                >
                  <Icons.sliders className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Customize your post viewing experience
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Sort By</h4>
                    <Select defaultValue="newest">
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Date Range</h4>
                    <Select defaultValue="all-time">
                      <SelectTrigger>
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-time">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
