import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5, 8, 10, 20, 50];

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-b-lg border-t border-border bg-slate-50 px-4 py-3 sm:flex-row sm:px-5">
      {/* Left: rows per page + range */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-size"
            className="whitespace-nowrap text-sm text-slate-600"
          >
            Rows per page:
          </label>
          <div className="relative">
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="h-8 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-100 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-200/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <span className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">{start}</span>–
          <span className="font-medium text-slate-700">{end}</span> of{" "}
          <span className="font-medium text-slate-700">{totalItems}</span>
        </span>
      </div>

      {/* Right: prev / next */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(currentPage - 1)}
          disabled={!canPrev}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <button
          type="button"
          onClick={() => canNext && onPageChange(currentPage + 1)}
          disabled={!canNext}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-100"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}