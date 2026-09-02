/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import useCategories from '../../api/hooks/common/useCategories';
import { useReproSearch } from '../../api/hooks/repro/useReproSearch';

import { parseFormattedNumber } from '../../app/util';
import ReproParams from './ReproParams';
import ReproSearchReults from './ReproSearchReults';
import React from 'react';
import useGrantsAllYears from '../../api/hooks/common/useGrantsAllYears';

type SelectedItem = {
  id: number;
  type: string;
};

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';
const MChild = React.memo(ReproParams);

const Search = () => {
  const [year, setYear] = useState<number>(2026);
  const [status, setStatus] = useState<number>(0);
  const [debitComparer, setDebitComparer] = useState<number>(0);
  const [creditComparer, setCreditComparer] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [l, setL] = useState(false);

  const { initiatives, iSuccess } = useInitiatives();
  const { grants, grantsSuccess } = useGrantsAllYears();
  const { categories, catSuccess } = useCategories(true, true);

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

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(
    iSuccess && grantsSuccess && catSuccess ? itemsList : [],
  );

  const { searchResults, successLoadingResults } = useReproSearch(
    selectedItems,
    status,
    year,
    debitComparer,
    debit,
    creditComparer,
    credit,
  );

  // console.log('grantsList', grantsList);
  // useEffect(() => {
  //   if (iSuccess && grantsSuccess && catSuccess && !l) {
  //     setL(true);
  //     setSelectedItems(itemsList);
  //     console.log('123', 123);
  //   }
  // }, [catSuccess, grantsSuccess, iSuccess, itemsList, l, selectedItems, year]);

  const handleListCheck = (id: number, type: string) => {
    setSelectedItems(
      selectedItems.some((x) => x.id === id && x.type === type)
        ? [
            ...selectedItems.filter(
              (x) => (x.type === type && x.id !== id) || x.type !== type,
            ),
          ]
        : [...selectedItems, { id: id, type: type }],
    );
  };

  const handleStatusChange = useCallback((status: number) => {
    setStatus(status);
  }, []);

  const handleYearChange = useCallback(
    (year: number) => {
      setSelectedItems((prev) => {
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

  // if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

  return (
    <div className="flex gap-2 mt-10">
      <div className="flex flex-1">
        <pre>{JSON.stringify(selectedItems)}</pre>
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
        {successLoadingResults && searchResults && (
          <ReproSearchReults results={searchResults}></ReproSearchReults>
        )}
        {searchResults && searchResults.length == 0 && (
          <div className="text-center">No reprogrammings found.</div>
        )}
      </div>
    </div>
  );
};
export default Search;
