/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState, type FocusEvent } from 'react';
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

  const debitRef = useRef<HTMLInputElement | null>(null);
  const creditRef = useRef<HTMLInputElement | null>(null);
  const [debitComparer, setDebitComparer] = useState(0);
  const [creditComparer, setCreditComparer] = useState(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const { initiatives, loadingInit, iSuccess } = useInitiatives();
  const { grants, loadingGrants, grantsSuccess } = useGrants(+year);
  const { categories, loadingCat, catSuccess } = useCategories(true, true);

  const [l, setL] = useState(false);

  const itemsList: SelectedItem[] = useMemo(() => {
    const i = initiatives?.length
      ? [
          ...initiatives!.map((i) => ({
            id: i.id,
            type: INITIATIVES_LIST_TYPE,
          })),
        ]
      : [];

    const g = grants?.length
      ? [
          ...grants!.map((i) => ({
            id: i.id,
            type: GRANTS_LIST_TYPE,
          })),
        ]
      : [];

    const a = categories?.length
      ? [
          ...categories!.map((i) => ({
            id: i.id,
            type: ACCOUNTS_LIST_TYPE,
          })),
        ]
      : [];
    const items = [...i, ...g, ...a];

    return items;
  }, [categories, grants, initiatives]);

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

  if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

  return (
    <div className='flex '>
      <div className='flex-1'>
        <ReproParams
          initiatives={initiatives!.map((x) => ({ id: x.id, name: x.name }))}
          grants={grants!.map((x) => ({ id: x.id, name: x.name }))}
          categories={categories!.map((x) => ({ id: x.id, name: x.name }))}
        ></ReproParams>
      </div>
      <div className='flex-4'></div>
    </div>
  );
};
export default Search;
