/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import useGrants from '../../api/hooks/common/useGrants';
import useCategories from '../../api/hooks/common/useCategories';
import { useReproSearch } from '../../api/hooks/repro/useReproSearch';

import { parseFormattedNumber } from '../../app/util';
import ReproParams from './ReproParams';

type SelectedItem = {
  id: number;
  type: string;
};

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';

const Search = () => {
  const [year, setYear] = useState(2026);
  const [status, setStatus] = useState<number>(0);

  const [debitComparer, setDebitComparer] = useState(0);
  const [creditComparer, setCreditComparer] = useState(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const { initiatives, loadingInit, iSuccess } = useInitiatives();
  const { grants, loadingGrants, grantsSuccess } = useGrants(+year);
  const { categories, loadingCat, catSuccess } = useCategories(true, true);

  const [l, setL] = useState(false);

  const initiativesList = useMemo(() => {
    return initiatives;
  }, [initiatives]);

  const grantsList = useMemo(() => {
    return grants;
  }, [grants]);

  const categoriesList = useMemo(() => {
    return categories;
  }, [categories]);

  const itemsList: SelectedItem[] = useMemo(() => {
    const i = initiativesList?.length
      ? [
          ...initiatives!.map((i) => ({
            id: i.id,
            type: INITIATIVES_LIST_TYPE,
          })),
        ]
      : [];

    const g = grantsList?.length
      ? [
          ...grants!.map((i) => ({
            id: i.id,
            type: GRANTS_LIST_TYPE,
          })),
        ]
      : [];

    const a = categoriesList?.length
      ? [
          ...categories!.map((i) => ({
            id: i.id,
            type: ACCOUNTS_LIST_TYPE,
          })),
        ]
      : [];
    const items = [...i, ...g, ...a];

    return items;
  }, [
    categories,
    categoriesList?.length,
    grants,
    grantsList?.length,
    initiatives,
    initiativesList?.length,
  ]);

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(itemsList);
  const { searchResults, loadingSearchResults } = useReproSearch(
    selectedItems,
    status,
    year,
    debitComparer,
    debit,
    creditComparer,
    credit,
  );

  useEffect(() => {
    if (iSuccess && grantsSuccess && catSuccess && !l) {
      setL(true);
      setSelectedItems(itemsList);
    }
  }, [catSuccess, grantsSuccess, iSuccess, itemsList, l, selectedItems]);

  const handleListCheck = useCallback(
    (id: number, type: string) => {
      setSelectedItems(
        selectedItems.some((x) => x.id === id && x.type === type)
          ? [
              ...selectedItems.filter(
                (x) => (x.type === type && x.id !== id) || x.type !== type,
              ),
            ]
          : [...selectedItems, { id: id, type: type }],
      );
    },
    [selectedItems],
  );

  const handleStatusChange = useCallback((status: number) => {
    setStatus(status);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setYear(year);
  }, []);

  function handleAmountBlur(amount: string, key: string) {
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
  }

  function handleComparerChange(value: number, key: string) {
    if (key == 'debit') {
      if (debitComparer !== value && debit > 0) {
        setDebitComparer(value);
      }
    }
    if (key == 'credit') {
      if (creditComparer !== value && credit > 0) {
        setCreditComparer(value);
      }
    }
  }

  if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

  return (
    <div className="flex gap-2">
      <div className="flex  flex-1">
        {/* <pre>{JSON.stringify(selectedItems)}</pre> */}
        <div>
          <ReproParams
            initiatives={initiativesList!.map((x) => ({
              id: x.id,
              name: x.name,
            }))}
            grants={grantsList!.map((x) => ({ id: x.id, name: x.name }))}
            categories={categoriesList!.map((x) => ({
              id: x.id,
              name: x.name,
            }))}
            onListCheck={handleListCheck}
            onStatusChange={handleStatusChange}
            onYearChange={handleYearChange}
            onAmountBlur={handleAmountBlur}
            onAmountComparerChange={handleComparerChange}
          ></ReproParams>
        </div>
      </div>
      <div className="p-2 flex-4">
        {searchResults?.length && searchResults.length}
      </div>
    </div>
  );
};
export default Search;
