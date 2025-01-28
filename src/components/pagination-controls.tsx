"use client";

import { useCollections } from "@/app/(collections)/collections-context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePostFilters } from "@/hooks/use-post-filters";
import { shouldRenderSearchAndFilterSection } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export function PaginationControls() {
  const { totalCollections } = useCollections();
  const pathname = usePathname();
  const { perPage, currentPage } = usePostFilters("/posts");
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCollections / perPage);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageUrl(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={createPageUrl(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (!shouldRenderSearchAndFilterSection(pathname)) {
    return null;
  }
  return (
    <Pagination className="justify-center">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
