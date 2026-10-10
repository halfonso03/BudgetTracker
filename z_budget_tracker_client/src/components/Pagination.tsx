type Props = {
  data?: PaginationData;
  onPageNumberChange: (pageNumber: number) => void;
};

export function Pagination({ data, onPageNumberChange }: Props) {
  if (!data) return;

  const pageNumbers = Array.from(
    { length: data.totalPages },
    (_, index) => index + 1,
  );
  return (
    <div className="flex gap-1 cursor-pointer ">
      {pageNumbers.map((p) => (
        <div
          key={p}
          className={p == data.currentPage ? 'page-link-active' : 'page-link'}
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
  );
}
