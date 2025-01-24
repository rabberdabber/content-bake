import { useRouter, useSearchParams } from "next/navigation";
import { POSTS_PER_PAGE } from "@/config/post";

export function usePostFilters(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search");
  const currentTag = searchParams.get("tag");
  const perPage = Number(searchParams.get("perPage")) || POSTS_PER_PAGE;

  const getUrlWithoutParam = (paramToRemove: string) => {
    const params = new URLSearchParams();
    if (searchQuery && paramToRemove !== "search")
      params.set("search", searchQuery);
    if (currentTag && currentTag !== "all" && paramToRemove !== "tag")
      params.set("tag", currentTag);
    if (currentPage > 1 && paramToRemove !== "page")
      params.set("page", currentPage.toString());
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
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (value && value !== "all") params.set("tag", value);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    params.set("perPage", value);
    router.push(
      `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return {
    currentPage,
    searchQuery,
    currentTag,
    perPage,
    getUrlWithoutParam,
    handleSearch,
    handleTagChange,
    handlePerPageChange,
  };
}
