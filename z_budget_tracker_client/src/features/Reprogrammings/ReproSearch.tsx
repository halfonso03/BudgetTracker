import { useCallback, useMemo, useState } from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import useCategories from '../../api/hooks/common/useCategories';
import { useReproSearch } from '../../api/hooks/repro/useReproSearch';

import { parseFormattedNumber } from '../../app/util';
import ReproParams from './ReproParams';
import ReproSearchReults from './ReproSearchReults';
import React from 'react';
import useGrantsAllYears from '../../api/hooks/common/useGrantsAllYears';
import { Pagination } from '../../components/Pagination';
import MenuIdProvider from '../../contexts/MenuIdContext';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useReproMutations } from '../../api/hooks/repro/useReproMutations';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

type SelectedItem = {
  id: number;
  type: string;
};

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';
const MemoizedReproParams = React.memo(ReproParams);

const ReproSearch = () => {
  const queryClient = useQueryClient();

  const [year, setYear] = useState<number>(2025);
  const [status, setStatus] = useState<number>(0);
  const [debitComparer, setDebitComparer] = useState<number>(0);
  const [creditComparer, setCreditComparer] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { initiatives } = useInitiatives();
  const { grants } = useGrantsAllYears();
  const { categories } = useCategories(true, true);

  const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
    useState(false);

  const [idToDelete, setIdToDelete] = useState(0);

  const initiativesList = useMemo(() => {
    return initiatives;
  }, [initiatives]);

  const accountsList = useMemo(() => {
    return categories;
  }, [categories]);

  const i = useMemo(() => {
    return initiativesList !== undefined && initiativesList !== null
      ? [
          ...initiatives!.map((i) => ({
            id: i.id,
            type: INITIATIVES_LIST_TYPE,
          })),
        ]
      : [];
  }, [initiatives, initiativesList]);

  const preG = grants?.filter((x) => x.year === year);

  const g = useMemo(() => {
    return preG !== undefined && preG !== null
      ? [
          ...preG!.map((i) => ({
            id: i.id,
            type: GRANTS_LIST_TYPE,
            year: i.year,
          })),
        ]
      : [];
  }, [preG]);

  const c = useMemo(() => {
    return accountsList !== undefined && accountsList !== null
      ? [
          ...categories!.map((i) => ({
            id: i.id,
            type: ACCOUNTS_LIST_TYPE,
          })),
        ]
      : [];
  }, [categories, accountsList]);

  const itemsList: SelectedItem[] = useMemo(() => {
    return [...i, ...g.filter((x) => x.year == year), ...c];
  }, [c, g, i, year]);

  const [selectedIds, setSelectedIds] = useState<SelectedItem[]>(itemsList);

  const itemsXList: SelectedItem[] = useMemo(() => {
    return [];
  }, [g, year]);

  const [xSelectedIds, setXSelectedIds] = useState<SelectedItem[]>(itemsXList);

  if (selectedIds.length == 0 && itemsList.length !== 0) {
    setSelectedIds(itemsList);
  }

  if (xSelectedIds.length == 0 && itemsXList.length !== 0) {
    setXSelectedIds(itemsList);
  }

  const { searchResults, successLoadingResults } = useReproSearch(
    {
      pageNumber: pageNumber,
      pageSize: import.meta.env.VITE_REPRO_SARCH_PAGE_SIZE,
    },
    {
      selectedIds,
      xSelectedIds,
      status,
      year,
      debitComparer,
      debitAmount: debit,
      creditComparer,
      creditAmount: credit,
    },
  );

  const { deleteRepro } = useReproMutations();

  const paginationData = searchResults?.pagination;

  const handleListCheck = (id: number, type: string) => {
    const removed = selectedIds.some((x) => x.id === id && x.type === type);

    const newSelectedIds = selectedIds.some(
      (x) => x.id === id && x.type === type,
    )
      ? [
          ...selectedIds.filter(
            (x) => (x.type === type && x.id !== id) || x.type !== type,
          ),
        ]
      : [...selectedIds, { id: id, type: type }];

    setSelectedIds(newSelectedIds);

    if (removed) {
      // may not be needed
      setXSelectedIds(
        xSelectedIds.filter(
          (x) => (x.type === type && x.id !== id) || x.type !== type,
        ),
      );
    }
    setPageNumber(1);
  };

  const handleListXCheck = (id: number, type: string) => {
    const newXSelectedIds = xSelectedIds.some(
      (x) => x.id === id && x.type === type,
    )
      ? [
          ...xSelectedIds.filter(
            (x) => (x.type === type && x.id !== id) || x.type !== type,
          ),
        ]
      : [...xSelectedIds, { id: id, type: type }];

    setXSelectedIds(newXSelectedIds);
    setPageNumber(1);
  };

  const handleStatusChange = useCallback((status: number) => {
    setStatus(status);
  }, []);

  const handleYearChange = useCallback(
    (year: number) => {
      setSelectedIds((prev) => {
        const i = prev.filter((x) => x.type == INITIATIVES_LIST_TYPE);
        const a = prev.filter((x) => x.type == ACCOUNTS_LIST_TYPE);
        const g = grants!
          .filter((x) => x.year === year)
          .map((x) => ({ id: x.id, type: GRANTS_LIST_TYPE }));
        return [...i, ...a, ...g];
      });
      setYear(year);
    },
    [grants],
  );

  const handleAmountBlur = useCallback(
    (amount: string, key: string) => {
      const number = parseFormattedNumber(amount);
      if (key == 'debit') {
        if (debit !== number) {
          setDebit(number);
        }
      }
      if (key == 'credit') {
        if (credit !== number) {
          setCredit(number);
        }
      }
      setPageNumber(1);
    },
    [credit, debit],
  );

  const handleComparerChange = useCallback(
    (value: number, key: string) => {
      if (key == 'debit') {
        if (debitComparer !== value) {
          setDebitComparer(value);
        }
      }
      if (key == 'credit') {
        if (creditComparer !== value) {
          setCreditComparer(value);
        }
      }
    },
    [creditComparer, debitComparer],
  );

  const handlePageNumberChange = useCallback((pageNumber2: number) => {
    setPageNumber(pageNumber2);
  }, []);

  const handleRefreshClick = () => {
    queryClient.invalidateQueries({ queryKey: ['repro_search'] });
    setPageNumber(1);
  };

  async function handleDelete(id: number) {
    setIdToDelete(id);
    setDeleteConfirmModalIsOpen(true);
  }

  async function deleteConfirmed() {
    try {
      await deleteRepro.mutateAsync(idToDelete, {
        onSuccess: () => {
          toast.success(
            <div>
              <div className="pb-1">{`Reprogramming ID ${idToDelete} has been deleted.`}</div>
              <div>Refreshing results...</div>
            </div>,
            {
              duration: 1500,
            },
          );
          setTimeout(
            () => queryClient.invalidateQueries({ queryKey: ['repro_search'] }),
            1000,
          );
        },
      });
    } catch (e) {
      console.log('e', e);
    }
  }

  function handleSelectAll(type: string) {
    const newSelectedIds: SelectedItem[] = [
      ...selectedIds.filter((x) => x.type !== type),
      ...itemsList.filter((x) => x.type == type),
    ];

    setSelectedIds(newSelectedIds);
  }

  function handleDeselectAll(type: string) {
    setSelectedIds((prev) => [...prev.filter((x) => x.type !== type)]);
    setXSelectedIds((prev) => prev.filter((x) => x.type !== type));
  }

  return (
    <div>
      {/* {searchResults?.searchId} */}

      <div className="flex gap-2 mt-10">
        <div className="flex flex-2">
          {/* <pre>{JSON.stringify(xSelectedIds)}</pre> */}
          <div>
            <MemoizedReproParams
              initiatives={initiativesList?.map((x) => ({
                id: x.id,
                name: x.name,
              }))}
              grants={grants
                ?.filter((x) => x.year === year)
                .map((x) => ({ id: x.id, name: x.name }))}
              accounts={accountsList?.map((x) => ({
                id: x.id,
                name: x.name,
              }))}
              onListCheck={handleListCheck}
              onListXCheck={handleListXCheck}
              onDeselectAll={handleDeselectAll}
              onSelectAll={handleSelectAll}
              onStatusChange={handleStatusChange}
              onYearChange={handleYearChange}
              onAmountBlur={handleAmountBlur}
              onAmountComparerChange={handleComparerChange}
            ></MemoizedReproParams>
          </div>
        </div>
        <div className="p-2 flex-7">
          {/* {searchResults && searchResults.data.items.length == 0 && (
          <div className="text-center justify-start">
            No reprogrammings found.
          </div>
        )} */}
          {successLoadingResults && searchResults && paginationData && (
            <MenuIdProvider>
              <div className="flex flex-col">
                <div className="flex justify-between pl-1 ">
                  <div className="pl-1 text-md font-semibold text-neutral-500 mb-3">
                    {paginationData.totalCount} Reprogramming
                    {paginationData.totalCount > 1 ? 's' : ''} found.
                  </div>
                  {searchResults.items.length > 0 && (
                    <button
                      className=" text-neutral-500 hover:text-blue-800 cursor-pointer hover:scale-115 transition-all duration-200"
                      onClick={handleRefreshClick}
                    >
                      <RefreshCw size={20}></RefreshCw>
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3 items-center justify-between min-h-[75dvh]">
                  <ReproSearchReults
                    key={searchResults.searchId}
                    results={searchResults.items}
                    onDelete={handleDelete}
                  ></ReproSearchReults>
                  <Pagination
                    data={paginationData}
                    onPageNumberChange={handlePageNumberChange}
                  ></Pagination>
                </div>
              </div>
            </MenuIdProvider>
          )}
        </div>
        <ConfirmModal
          onCancel={() => {
            setTimeout(() => {
              setDeleteConfirmModalIsOpen(false);
            }, 500);
          }}
          message={`Reprogramming ID ${idToDelete} will be deleted. Click OK to continue.`}
          isOpen={deleteConfirmModalIsOpen}
          onConfirm={() => {
            setTimeout(() => {
              setDeleteConfirmModalIsOpen(false);
              setTimeout(deleteConfirmed, 100);
            }, 500);
          }}
        ></ConfirmModal>
      </div>
    </div>
  );
};
export default ReproSearch;

// if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

// console.log('grantsList', grantsList);
// useEffect(() => {
//   if (iSuccess && grantsSuccess && catSuccess && !l) {
//     setL(true);
//     setSelectedItems(itemsList);
//     console.log('123', 123);
//   }
// }, [catSuccess, grantsSuccess, iSuccess, itemsList, l, selectedItems, year]);
