import { useRouter, useSearchParams } from "next/navigation";
import { POSTS_PER_PAGE } from "@/config/post";

export function usePostFilters(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search");
  const currentTag = searchParams.get("tag");
  const perPage = Number(searchParams.get("perPage")) || POSTS_PER_PAGE;
  const sortBy = searchParams.get("sort") || "newest";
  const dateRange = searchParams.get("dateRange") || "all-time";

  const getUrlWithoutParam = (paramToRemove: string) => {
    const params = new URLSearchParams();
    if (searchQuery && paramToRemove !== "search")
      params.set("search", searchQuery);
    if (currentTag && currentTag !== "all" && paramToRemove !== "tag")
      params.set("tag", currentTag);
    if (currentPage > 1 && paramToRemove !== "page")
      params.set("page", currentPage.toString());
    if (sortBy !== "newest" && paramToRemove !== "sort")
      params.set("sort", sortBy);
    if (dateRange !== "all-time" && paramToRemove !== "dateRange")
      params.set("dateRange", dateRange);

    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (dateRange !== "all-time") params.set("dateRange", dateRange);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (value && value !== "all") params.set("tag", value);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (dateRange !== "all-time") params.set("dateRange", dateRange);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (dateRange !== "all-time") params.set("dateRange", dateRange);
    params.set("perPage", value);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (value !== "newest") params.set("sort", value);
    if (dateRange !== "all-time") params.set("dateRange", dateRange);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleDateRangeChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (value !== "all-time") params.set("dateRange", value);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return {
    currentPage,
    searchQuery,
    currentTag,
    perPage,
    sortBy,
    dateRange,
    getUrlWithoutParam,
    handleSearch,
    handleTagChange,
    handlePerPageChange,
    handleSortChange,
    handleDateRangeChange,
  };
}
