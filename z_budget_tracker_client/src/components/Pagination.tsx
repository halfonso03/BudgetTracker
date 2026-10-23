import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../contexts/pagination/usePagination';

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
    <div className="flex items-center justify-between mt-2 px-2 text-neutral-500 w-full">
      <div className="flex-2">
        <span>
          Showing page{' '}
          <span className="font-medium text-neutral-900">
            {data?.currentPage}
          </span>{' '}
          of {data?.totalPages}
        </span>
      </div>

      <div className="flex-2">{data?.totalCount} results found.</div>
      <div className=" grow-0  gap-1 cursor-pointer border">
        <div>
          <button
            onClick={() => setPageNumber(Math.max(data!.currentPage - 1, 1))}
            disabled={data?.currentPage === 1}
            className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={20} className="cursor-pointer" />
          </button>
        </div>
        <div className="flex flex-wrap ">
          {pageNumbers.map((p) => (
            <div
              key={p}
              className={
                p == data.currentPage ? 'page-link-active' : 'page-link'
              }
            >
              <div
                onClick={() => onPageNumberChange(p)}
                key={p}
                className={`px-3 py-1.5 rounded-md transition-colors duration-200 font-medium ${
                  data.currentPage === p
                    ? 'bg-neutral-500 text-white'
                    : 'hover:bg-neutral-400 text-neutral-600 hover:text-white'
                }`}
              >
                {p}
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={() => setPageNumber(data!.currentPage + 1)}
            disabled={data?.currentPage === data?.totalPages}
            className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={20} className="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}
