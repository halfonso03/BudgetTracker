import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { usePaymentSearch } from '../../api/hooks/payments/usePaymentSearch';
import { RefreshCw } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { Pagination } from '../../components/Pagination';
import MenuIdProvider from '../../contexts/MenuIdContext';
import PaymentSearchReults from './PaymentSearchReults';
import React from 'react';
import PaymentSearchParams from './PaymentSearchParams';

type SelectedItem = {
  id: number;
  type: string;
};

const MemoizedSearchParams = React.memo(PaymentSearchParams);


const PaymentSearch = () => {
  const queryClient = useQueryClient();
  const [year, setYear] = useState<number>(2026);
  const [status, setStatus] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [years] = useState<{ id: number; name: string }[]>(() => {
    const years = [];

    for (let x = 0; x <= 1; x++) {
      years.push(new Date().getFullYear() - x);
    }

    return years.map((y) => ({ id: y, name: y.toString() }));
  });
  // const [selectedIds, setSelectedIds] = useState<SelectedItem[]>(itemsList);

  const { searchResults, successLoadingResults, loadingSearchResults } =
    usePaymentSearch(
      {
        pageNumber: pageNumber,
        pageSize: import.meta.env.VITE_REPRO_SEARCH_PAGE_SIZE,
      },
      {
        status,
        year,
      },
    );

  const paginationData = searchResults?.pagination;

  const handleStatusChange = useCallback((status: number) => {
    setStatus(status);
    setPageNumber(1);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    console.log('year', year);
    //   setSelectedIds((prev) => {
    //     const i = prev.filter((x) => x.type == INITIATIVES_LIST_TYPE);
    //     const a = prev.filter((x) => x.type == ACCOUNTS_LIST_TYPE);
    //     const g = grants!
    //       .filter((x) => x.year === year)
    //       .map((x) => ({ id: x.id, type: GRANTS_LIST_TYPE }));
    //     return [...i, ...a, ...g];
    //   });
      setYear(year);
      setPageNumber(1);
  }, []);

  const handlePageNumberChange = useCallback((pageNumber: number) => {
    setPageNumber(pageNumber);
  }, []);

  const handleRefreshClick = () => {
    queryClient.invalidateQueries({ queryKey: ['repro_search'] });
    setPageNumber(1);
  };

  return (
    <div>
      <div className="flex gap-2 mt-10">
        <div className="p-2 flex-7">
          <div className="mb-4">
            <MemoizedSearchParams
              // initiatives={initiativesList?.map((x) => ({
              //   id: x.id,
              //   name: x.name,
              // }))}
              // grants={grants
              //   ?.filter((x) => x.year === year)
              //   .map((x) => ({ id: x.id, name: x.name }))}
              // accounts={accountsList?.map((x) => ({
              //   id: x.id,
              //   name: x.name,
              // }))}
              years={years}
              // onListCheck={handleListCheck}
              // onListXCheck={handleListXCheck}
              // onDeselectAll={handleDeselectAll}
              // onSelectAll={handleSelectAll}
              onStatusChange={handleStatusChange}
              onYearChange={handleYearChange}
              // onAmountFilter={handleAmountFilter}
              // onAmountFilterCancel={handleAmountFilterCancel}
            ></MemoizedSearchParams>
          </div>
          {loadingSearchResults && (
            <div className="mt-16 ">
              <Skeleton
                height={35}
                width="100%"
                enableAnimation={true}
                count={15}
                containerClassName="flex-1"
              />
            </div>
          )}
          {successLoadingResults && paginationData && (
            <MenuIdProvider>
              <div className="flex flex-col">
                <div className="flex justify-between  pl-1 items-center mb-4 ">
                  <div className="text-md font-semibold text-neutral-500  ">
                    {paginationData.totalCount} Payment
                    {paginationData.totalCount > 1 || paginationData.totalCount === 0 ? 's' : ''} found.
                  </div>
                  {searchResults && searchResults.items.length > 0 && (
                    <div>
                      <button
                        className="text-neutral-500 hover:text-blue-800 cursor-pointer hover:scale-115 transition-all duration-200 "
                        onClick={handleRefreshClick}
                      >
                        <RefreshCw size={20}></RefreshCw>
                      </button>
                    </div>
                  )}
                </div>

                {successLoadingResults && searchResults && (
                  <PaymentSearchReults
                    key={searchResults.searchId}
                    results={searchResults.items}
                    // onDelete={handleDelete}
                  ></PaymentSearchReults>
                )}

                {searchResults &&
                  searchResults?.items.length > 0 &&
                  paginationData && (
                    <Pagination
                      data={paginationData}
                      onPageNumberChange={handlePageNumberChange}
                    ></Pagination>
                  )}
              </div>
            </MenuIdProvider>
          )}
        </div>
        {/* <ConfirmModal
          onCancel={() => {
            setTimeout(() => {
              setDeleteConfirmModalIsOpen(false);
            }, 500);
          }}
          message={`WARNING: Reprogramming ID ${idToDelete} will be deleted! Click OK to continue.`}
          isOpen={deleteConfirmModalIsOpen}
          onConfirm={() => {
            setTimeout(() => {
              setDeleteConfirmModalIsOpen(false);
              setTimeout(deleteConfirmed, 100);
            }, 500);
          }}
        ></ConfirmModal> */}
      </div>
    </div>
  );
};
export default PaymentSearch;
