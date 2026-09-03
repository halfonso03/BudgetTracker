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
            className="py-1 px-3"
          >
            {p}
          </div>
        </div>
      ))}
    </div>
  );
}
