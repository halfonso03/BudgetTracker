import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePagination } from '../contexts/pagination/usePagination';
import { memo } from 'react';

type Props = {
  data: PaginationData;
  onPageNumberChange: (pageNumber: number) => void;
};

export function Pagination({ data, onPageNumberChange }: Props) {
  const { setPageNumber } = usePagination();

  const pageNumbers = Array.from(
    { length: data.totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className=" grid grid-cols-[1fr_1fr_1fr] items-center px-2 text-neutral-500 w-full mt-6 mb-16 dark:text-slate-400 ">
      <div>
        <span>
          Showing page{' '}
          <span className="font-semibold text-neutral-900 dark:text-slate-400">
            {data?.currentPage}
          </span>{' '}
          of {data?.totalPages}
        </span>
      </div>

      <div className="flex justify-center ">
        {data?.totalCount} results found.
      </div>
      <div className="flex justify-end items-center gap-1 cursor-pointer ">
        <div>
          <button
            onClick={() => {
              onPageNumberChange(1);
              setPageNumber(1);
            }}
            disabled={data?.currentPage === 1}
            className="cursor-pointer disabled:cursor-default  p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-600 text-neutral-600 dark:text-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronFirst size={20} className=""></ChevronFirst>
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              onPageNumberChange(Math.max(data!.currentPage - 1, 1));
              setPageNumber(Math.max(data!.currentPage - 1, 1));
            }}
            disabled={data?.currentPage === 1}
            className="cursor-pointer disabled:cursor-default  p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-600 text-neutral-600 dark:text-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="flex gap-1 ">
          {pageNumbers.length > 12 && (
            <Pager
              currentPage={data!.currentPage}
              pageNumbers={pageNumbers}
              onPageNumberChange={onPageNumberChange}
            />
          )}
          {pageNumbers.length <= 12 &&
            pageNumbers.map((p) => (
              <div
                key={p}
                onClick={() => onPageNumberChange(p)}
                className={`px-3 py-1.5 rounded-md transition-colors duration-200 font-medium dark:hover:bg-slate-600 dark:text-white ${
                  data.currentPage === p
                    ? 'bg-neutral-500 text-white  dark:bg-slate-600/70'
                    : 'hover:bg-neutral-400 text-neutral-600 hover:text-white dark:hover:bg-slate-600  '
                }`}
              >
                {p}
              </div>
            ))}
        </div>
        <button
          onClick={() => {
            setPageNumber(data!.currentPage + 1);
            onPageNumberChange(data!.currentPage + 1);
          }}
          disabled={data?.currentPage === data?.totalPages}
            className="cursor-pointer disabled:cursor-default  p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-600 text-neutral-600 dark:text-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight size={20} />
        </button>
        <div>
          <button
            onClick={() => {
              onPageNumberChange(pageNumbers.length);
              setPageNumber(pageNumbers.length);
            }}
            disabled={
              data?.currentPage >= pageNumbers[pageNumbers.length - 1] ||
              data?.totalPages < 12
            }
            // disabled={data?.currentPage === pageNumbers[pageNumbers.length]}
            className="cursor-pointer disabled:cursor-default  p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-600 text-neutral-600 dark:text-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLast size={20}></ChevronLast>
          </button>
        </div>
      </div>
    </div>
  );
}

type PagerProps = {
  pageNumbers: number[];
  currentPage: number;
  onPageNumberChange: (pageNumber: number) => void;
};

const Pager = memo(
  ({ onPageNumberChange, pageNumbers, currentPage }: PagerProps) => {
    // eslint-disable-next-line no-useless-assignment
    let firstPageNumber = 0;
    // eslint-disable-next-line no-useless-assignment
    let lastPageNumber = 0;
    let showLeftEllipses = false;
    let showRightEllipses = false;

    if ((pageNumbers.length ?? 0) < 6) {
      firstPageNumber = 1;
      lastPageNumber = 6;
    } else {
      firstPageNumber = currentPage - 3;
      lastPageNumber = currentPage + 3;
      showLeftEllipses = true;
      showRightEllipses = true;
      if (lastPageNumber > pageNumbers[pageNumbers.length - 1]) {
        lastPageNumber = pageNumbers[pageNumbers.length - 1];
      }
    }

    if (firstPageNumber < 1) {
      firstPageNumber = 1;
      lastPageNumber = 6;
    }

    if (lastPageNumber - currentPage <= 2) {
      showRightEllipses = false;
    }

    if (firstPageNumber === 1) showLeftEllipses = false;

    const currentPageNumbers: number[] = [];

    for (let x = firstPageNumber; x <= lastPageNumber; x++) {
      currentPageNumbers.push(x);
    }

    return (
      <div className="flex items-center ">
        {showLeftEllipses && <div className="text-lg tracking-widest">...</div>}
        {currentPageNumbers.map((p) => (
          <div
            key={p}
            className={p == currentPage ? 'page-link-active' : 'page-link'}
          >
            <div
              onClick={() => {
                onPageNumberChange(p);
              }}
              key={p}
              className={`px-3 py-1.5 rounded-md transition-colors duration-200 font-medium ${
                currentPage === p
                  ? 'bg-neutral-500 text-white dark:bg-slate-600 dark:text-white'
                  : 'hover:bg-neutral-400 dark:bg-slate-400 text-neutral-600 hover:text-white'
              }`}
            >
              {p}
            </div>
          </div>
        ))}
        {showRightEllipses && (
          <div className="text-lg tracking-widest">...</div>
        )}
      </div>
    );
  },
);
