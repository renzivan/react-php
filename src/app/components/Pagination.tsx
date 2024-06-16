"use strict";
import Image from "next/image";
import classNames from 'classnames';

export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const leftPages = Math.max(1, currentPage - 2);
  const rightPages = Math.min(totalPages, currentPage + 2);

  return (
    <div className="h-16 px-6 flex items-center justify-between">
      <button
        className={classNames(
          'flex items-center gap-2 text-slate-900 justify-center font-semibold text-sm border border-gray-300 px-4 py-2 rounded',
          { 'cursor-not-allowed bg-slate-100': currentPage === 1 }
        )}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <Image
          src="/arrow-left.svg"
          alt="Previous"
          className="dark:invert"
          width={14}
          height={14}
          priority
        />
        Previous
      </button>

      <div className="flex items-center text-gray-500 text-sm font-medium">
        {leftPages > 1 && <div>...</div>}
        {Array.from({ length: rightPages - leftPages + 1 }, (_, i) => (
          <button
            key={i + leftPages}
            className={classNames(
              'w-10 h-10 flex items-center justify-center',
              { 'bg-gray-50 rounded-md text-slate-900': currentPage === i + leftPages }
            )}
            onClick={() => setCurrentPage(i + leftPages)}
          >
            {i + leftPages}
          </button>
        ))}
        {rightPages < totalPages && <div>...</div>}
      </div>

      <button
        className={classNames(
          'flex items-center gap-2 text-slate-900 justify-center font-semibold text-sm border border-gray-300 px-4 py-2 rounded',
          { 'cursor-not-allowed bg-slate-100': currentPage === totalPages }
        )}
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
        <Image
          src="/arrow-right.svg"
          alt="Next"
          className="dark:invert"
          width={14}
          height={14}
          priority
        />
      </button>
    </div>
  );
};
