import { Check, DollarSign, Pencil, X } from 'lucide-react';
import { useVendors } from '../../api/hooks/vendors/useVendors';
import { formatDate, formatNumber } from '../../app/util';
import { Pagination } from '../../components/Pagination';
import { usePagination } from '../../contexts/pagination/usePagination';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';
import { useEffect, useState } from 'react';
import VendorDetailsWindow from './VendorDetailsWindow';
import Search from '../../components/Search';

// type Props = {
//   vendors: Vendor[];
// };

const List = () => {
  const { data, loadingVendors } = useVendors();
  const { setPageNumber, setSearchTerm } = usePagination();
  const { sortByValue, setSortByValue } = useSortingContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const paginationData = data?.pagination;
  console.log('sortByValue', sortByValue);
  console.log('paginationData', paginationData);
  // const [vendorsState, setVendorsState] = useState<Vendor[] | undefined>(
  //   vendors,
  // );

  function openDetails(vendor: Vendor) {
    setSelectedVendor(vendor);
    setDetailsOpen(true);
  }

  useEffect(() => {
    setSortByValue('NAME');
  }, [setSortByValue]);

  function handlePageNumberChange(pageNumber: number) {
    setPageNumber(pageNumber);
  }

  function handleDetailsClose() {
    setDetailsOpen(false);
  }
  function handleSearch(searchTerm: string) {
    setSearchTerm(searchTerm);
    setPageNumber(1);
  }
  if (loadingVendors) return null;

  return (
    <div className="mx-auto w-[80%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="flex justify-end w-full mb-4">
        <div className="w-[35%]">
          <Search
            onSearch={(searchTerm: string) => handleSearch(searchTerm)}
          ></Search>
        </div>
      </div>

      <input type="text" />
      <div className="mb-1  grid grid-cols-[1fr_1fr_.7fr_.7fr_.6fr_.2fr_.2fr_.2fr] gap-2 p-1  font-semibold text-neutral-700 border-b border-b-neutral-300">
        <div className="flex justify-start">
          <SortBySelector
            label="Name"
            value="NAME"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <SortBySelector
            label="Charge Account"
            value="ACCOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <SortBySelector
            label="Total Paid"
            value="TOTALPAID"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <SortBySelector
            label="Last Payment"
            value="LASTPAYMENTDATE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <SortBySelector
            label="Days Since Last Payment"
            value="DAYSSINCELASTPAYMENT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex  justify-end">
          <SortBySelector
            label="Active"
            value="ACTIVE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="text-center self-center">Edit</div>
        <div className="text-center self-center">Pay</div>
      </div>
      <div className="">
        {data?.vendors?.map((v) => (
          <div
            className="rounded-sm grid grid-cols-[1fr_1fr_.7fr_.7fr_.6fr_.2fr_.2fr_.2fr] gap-2 p-1 items-center hover:bg-neutral-200 duration-200 transition-all cursor-pointer"
            key={v.id}
          >
            <div>{v.name}</div>
            <div className="text-center">{v.accountName}</div>
            <div className="text-center">
              {v.lastPayment ? formatDate(v.lastPayment) : '-'}
            </div>
            <div className="text-center">
              {v.totalPaid ? formatNumber(v.totalPaid) : '-'}
            </div>
            <div className="text-center ">{v.daysSinceLastPayment || '-'}</div>
            <div className="flex justify-center ">
              {v.isActive ? (
                <Check className="text-green-600"></Check>
              ) : (
                <X className="text-red-600"></X>
              )}
            </div>
            <div className="flex justify-center ">
              <Pencil
                className=" text-neutral-600 cursor-pointer"
                onClick={() => {
                  openDetails(v);
                }}
              ></Pencil>
            </div>
            <div className="flex justify-center ">
              <DollarSign
                className={`${!v.isActive ? 'text-neutral-400' : 'text-blue-500'} cursor-pointer`}
              ></DollarSign>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          data={data?.pagination}
          onPageNumberChange={handlePageNumberChange}
        ></Pagination>
      </div>
      {detailsOpen && (
        <VendorDetailsWindow
          vendor={selectedVendor!}
          onClose={handleDetailsClose}
        ></VendorDetailsWindow>
      )}
    </div>
  );
};
export default List;
