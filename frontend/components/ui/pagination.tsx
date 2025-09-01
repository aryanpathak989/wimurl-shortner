import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center p-3 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "p-2 rounded-md",
          currentPage === 1 ? "opacity-40 cursor-not-allowed" : "bg-primary text-white"
        )}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => handlePageClick(page)}
          className={clsx(
            "px-3 py-1 rounded-md text-sm",
            page === currentPage
              ? "bg-primary text-white font-bold"
              : page === "..."
              ? "cursor-default text-muted-foreground"
              : "hover:bg-primary/20"
          )}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "p-2 rounded-md",
          currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "bg-primary text-white"
        )}
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
