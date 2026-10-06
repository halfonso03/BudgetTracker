import Button from "../components/Button";

type Props = {
  data?: PaginationData;
  setPageNumber: (pageNumber: number) => void;
};

export function Pagination({ data, setPageNumber }: Props) {
  if (!data) return;

  const pageNumbers = Array.from(
    { length: data.totalPages },
    (_, index) => index + 1,
  );

  if (pageNumbers.length === 1) return null;
  return (
    <div className="flex justify-center gap-1 cursor-pointer w-full">
      {pageNumbers.map((p) => (
        <div
          key={p}
          className={
            'page-link' + (p == data.currentPage ? ' page-link-active' : '')
          }
        >
          <Button
            onClick={() => setPageNumber(p)}
            key={p}
            className="p-1 px-3 transition-all duration-200"
          >
            {p}
          </Button>
        </div>
      ))}
    </div>
  );
}
