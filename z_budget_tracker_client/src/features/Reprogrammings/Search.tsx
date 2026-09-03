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
import {  RefreshCw } from 'lucide-react';
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
const MChild = React.memo(ReproParams);

const Search = () => {
  const queryClient = useQueryClient();

  const [year, setYear] = useState<number>(2026);
  const [status, setStatus] = useState<number>(0);
  const [debitComparer, setDebitComparer] = useState<number>(0);
  const [creditComparer, setCreditComparer] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  // const [l, setL] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { initiatives, iSuccess } = useInitiatives();
  const { grants, grantsSuccess } = useGrantsAllYears();
  const { categories, catSuccess } = useCategories(true, true);

  const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
    useState(false);

  const [idToDelete, setIdToDelete] = useState(0);

  const initiativesList = useMemo(() => {
    return initiatives;
  }, [initiatives]);

  const categoriesList = useMemo(() => {
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

  const a = useMemo(() => {
    return categoriesList !== undefined && categoriesList !== null
      ? [
          ...categories!.map((i) => ({
            id: i.id,
            type: ACCOUNTS_LIST_TYPE,
          })),
        ]
      : [];
  }, [categories, categoriesList]);

  const itemsList: SelectedItem[] = useMemo(() => {
    return [...i, ...g.filter((x) => x.year == year), ...a];
  }, [a, g, i, year]);

  const [selectedIds, setSelectedIds] = useState<SelectedItem[]>(
    iSuccess && grantsSuccess && catSuccess ? itemsList : [],
  );

  const { searchResults, successLoadingResults } = useReproSearch(
    {
      pageNumber: pageNumber,
      pageSize: import.meta.env.VITE_REPRO_SARCH_PAGE_SIZE,
    },
    {
      selectedIds,
      status,
      year,
      debitComparer,
      debit,
      creditComparer,
      credit,
    },
  );

  const { deleteRepro } = useReproMutations();

  const paginationData = searchResults?.pagination;
  // console.log('grantsList', grantsList);
  // useEffect(() => {
  //   if (iSuccess && grantsSuccess && catSuccess && !l) {
  //     setL(true);
  //     setSelectedItems(itemsList);
  //     console.log('123', 123);
  //   }
  // }, [catSuccess, grantsSuccess, iSuccess, itemsList, l, selectedItems, year]);

  const handleListCheck = (id: number, type: string) => {
    setSelectedIds(
      selectedIds.some((x) => x.id === id && x.type === type)
        ? [
            ...selectedIds.filter(
              (x) => (x.type === type && x.id !== id) || x.type !== type,
            ),
          ]
        : [...selectedIds, { id: id, type: type }],
    );
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
              <div>Refreshing results..</div>
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

  // if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

  return (
    <div className="flex gap-2 mt-10">
      <div className="flex flex-1">
        {/* <pre>{JSON.stringify(selectedItems)}</pre> */}
        <div>
          <MChild
            initiatives={initiativesList?.map((x) => ({
              id: x.id,
              name: x.name,
            }))}
            grants={grants
              ?.filter((x) => x.year === year)
              .map((x) => ({ id: x.id, name: x.name }))}
            categories={categoriesList?.map((x) => ({
              id: x.id,
              name: x.name,
            }))}
            onListCheck={handleListCheck}
            onStatusChange={handleStatusChange}
            onYearChange={handleYearChange}
            onAmountBlur={handleAmountBlur}
            onAmountComparerChange={handleComparerChange}
          ></MChild>
        </div>
      </div>
      <div className="p-2 flex-4">
        {searchResults && searchResults.data.items.length == 0 && (
          <div className="text-center justify-start">
            No reprogrammings found.
          </div>
        )}
        {successLoadingResults && searchResults && (
          <MenuIdProvider>
            <div className="flex flex-col">
              {searchResults.data.items.length > 0 && (
                <button
                  className="self-end text-neutral-700 hover:text-neutral-900 cursor-pointer"
                  onClick={handleRefreshClick}
                >
                  <RefreshCw size={20}></RefreshCw>
                </button>
              )}

              <div className="flex flex-col gap-3 items-center justify-between min-h-[75dvh]">
                <ReproSearchReults
                  results={searchResults.data.items}
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
            setTimeout(deleteConfirmed, 100)
          }, 500);
        }}
      ></ConfirmModal>
    </div>
  );
};
export default Search;
