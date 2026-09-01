/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import Select from '../../components/Select';
import useGrants from '../../api/hooks/common/useGrants';
import CheckBoxList from '../../components/CheckBoxList';
import useCategories from '../../api/hooks/common/useCategories';
import { useReproSearch } from '../../api/hooks/repro/useReproSearch';

import NumericInputUncontrolled from '../../components/NumericInputUncontrolled';
import { parseFormattedNumber } from '../../app/util';

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

  const { initiatives, loadingInit, iSuccess } = useInitiatives();
  const { grants, loadingGrants, grantsSuccess } = useGrants(+year);
  const { categories, loadingCat, catSuccess } = useCategories(true, true);
  const [debitComparer, setDebitComparer] = useState(0);
  const [creditComparer, setCreditComparer] = useState(0);
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
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
    console.log('selectedItems', selectedItems);
  }, [catSuccess, grantsSuccess, iSuccess, itemsList, l, selectedItems]);

  if (loadingInit || loadingGrants || loadingCat) return <div>Loading...</div>;

  function handleCheck(id: number, type: string) {
    setSelectedItems(
      selectedItems.some((x) => x.id === id && x.type === type)
        ? [
            ...selectedItems.filter(
              (x) => (x.type === type && x.id !== id) || x.type !== type,
            ),
          ]
        : [...selectedItems, { id: id, type: type }],
    );
  }

  function handleAmountBlur(e: FocusEvent<HTMLInputElement>, key: string) {
    const value = e.target.value;
    const number = parseFormattedNumber(value);
console.log('key', key)
    if (key == 'debit') {
      if (debit !== number) {
        setDebit(number);
      }
    }
    console.log('credit', credit)
    if (key == 'credit') {
      if (credit !== number) {
        setCredit(number);
      }
    }
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(selectedItems)}</pre> */}

      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 border border-b-0 border-neutral-200 p-2 rounded-t-md">
            <div className="font-semibold text-neutral-600 ml-1 self-center">
              Year:
            </div>
            <Select
              value={year}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setYear(+e.target.value)
              }
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </Select>
          </div>
          <div className="border border-b-0 border-neutral-200 ">
            <CheckBoxList
              label="Initiative:"
              id={INITIATIVES_LIST_TYPE}
              onCheck={handleCheck}
              items={
                initiatives?.length
                  ? initiatives.map((i) => ({ ...i, checked: true }))
                  : []
              }
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200">
            <CheckBoxList
              label="Award:"
              id={GRANTS_LIST_TYPE}
              onCheck={handleCheck}
              items={grants!.map((i) => ({ ...i, checked: true }))!}
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200">
            <CheckBoxList
              label="Account:"
              id={ACCOUNTS_LIST_TYPE}
              maxHeight={160}
              onCheck={handleCheck}
              items={categories!.map((i) => ({ ...i, checked: true }))!}
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200 pl-2 py-2 flex gap-3 pr-2">
            <div className="font-semibold text-neutral-600 ml-1 self-center">
              Status:
            </div>
            <Select
              value={status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setStatus(+e.target.value)
              }
            >
              <option value="0">All</option>
              <option value="1">Saved</option>
              <option value="2">Posted</option>
            </Select>
          </div>
          <div className="border border-b-0 border-neutral-200 p-2 py-3">
            <div className="font-semibold text-neutral-600 ml-1">
              Debit Amount:
            </div>
            <div className="flex gap-2">
              <Select
                widthClass={'w-35'}
                value={debitComparer}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setDebitComparer(+e.target.value)
                }
              >
                <option value="0">Less than</option>
                <option value="1">Greater Than</option>
                <option value="2">Equal To</option>
              </Select>
              <NumericInputUncontrolled
                className="border border-neutral-300 p-1 rounded-md text-end "
                placeholder="Amount..."
                ref={debitRef}
                onBlur={(e) => {
                  handleAmountBlur(e, 'debit');
                }}
              ></NumericInputUncontrolled>
            </div>
          </div>
          <div className="border border-neutral-200 p-2 py-3">
            <div className="font-semibold text-neutral-600 ml-1">
              Credit Amount:
            </div>
            <div className="flex gap-2">
              <Select
                widthClass={'w-35'}
                value={creditComparer}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCreditComparer(+e.target.value)
                }
              >
                <option value="0">Less than</option>
                <option value="1">Greater Than</option>
                <option value="2">Equal To</option>
              </Select>
              <NumericInputUncontrolled
                className="border border-neutral-300 p-1 rounded-md text-end "
                placeholder="Amount..."
                ref={creditRef}
                onBlur={(e) => {
                  handleAmountBlur(e, 'credit');
                }}
              ></NumericInputUncontrolled>
            </div>
          </div>
        </div>
        <div className="flex-4 p-2 ">
          {!loadingSearchResults && searchResults?.length && (
            <div>{searchResults.length}</div>
          )}
        </div>
        {/* <Button
        onClick={() => {
          saveSearchParams({ year: 2026, initiativeIds: [1, 2, 3] });
        }}
      >
        Save Params
      </Button> */}
      </div>
    </div>
  );
};
export default Search;
