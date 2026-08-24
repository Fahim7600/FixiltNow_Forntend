import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl bg-[#181512] border border-[#2d2722] text-[#d4ceb8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#221e1a] hover:text-[#fbbf24] transition-colors cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5 px-2 text-sm font-medium font-heading">
        <span className="text-[#fbbf24] font-bold">{page}</span>
        <span className="text-[#6b6359]">/</span>
        <span className="text-[#a8a095]">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl bg-[#181512] border border-[#2d2722] text-[#d4ceb8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#221e1a] hover:text-[#fbbf24] transition-colors cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
