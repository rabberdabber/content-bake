import { useRouter, useSearchParams } from "next/navigation";
import { POSTS_PER_PAGE } from "@/config/post";

export function usePostFilters(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search");
  const currentTag = searchParams.get("tag");
  const perPage = Number(searchParams.get("perPage")) || POSTS_PER_PAGE;
  const sortOrder = searchParams.get("sort_order") || "desc";
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  const getUrlWithoutParam = (paramToRemove: string) => {
    const params = new URLSearchParams();
    if (searchQuery && paramToRemove !== "search")
      params.set("search", searchQuery);
    if (currentTag && currentTag !== "all" && paramToRemove !== "tag")
      params.set("tag", currentTag);
    if (currentPage > 1 && paramToRemove !== "page")
      params.set("page", currentPage.toString());
    if (sortOrder !== "desc" && paramToRemove !== "sort_order")
      params.set("sort_order", sortOrder);
    if (startDate && paramToRemove !== "start_date")
      params.set("start_date", startDate);
    if (endDate && paramToRemove !== "end_date")
      params.set("end_date", endDate);

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
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (startDate && endDate) {
      params.set("start_date", startDate);
      params.set("end_date", endDate);
    }
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (value && value !== "all") params.set("tag", value);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (startDate && endDate) {
      params.set("start_date", startDate);
      params.set("end_date", endDate);
    }
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (startDate && endDate) {
      params.set("start_date", startDate);
      params.set("end_date", endDate);
    }
    params.set("perPage", value);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleSortChange = (value: "asc" | "desc") => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (value !== "desc") params.set("sort_order", value);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (start) params.set("start_date", start);
    if (end) params.set("end_date", end);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return {
    currentPage,
    searchQuery,
    currentTag,
    perPage,
    sortOrder,
    startDate,
    endDate,
    getUrlWithoutParam,
    handleSearch,
    handleTagChange,
    handlePerPageChange,
    handleSortChange,
    handleDateRangeChange,
  };
}
