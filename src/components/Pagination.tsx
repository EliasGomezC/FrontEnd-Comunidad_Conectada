"use client";

import type { NextPage } from "next";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: NextPage<PaginationProps> = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) => {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="text-center py-5 flex justify-center gap-1 flex-wrap">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`w-[38px] h-[38px] border border-[#0a496a] rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            page === currentPage
              ? "bg-[#0a496a] text-white"
              : "bg-transparent text-[#0a496a] hover:bg-[#0a496a] hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          <span className="flex items-center px-2">…</span>
          <button
            onClick={() => onPageChange?.(totalPages)}
            className="w-[38px] h-[38px] border border-[#0a496a] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0a496a] hover:text-white transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
