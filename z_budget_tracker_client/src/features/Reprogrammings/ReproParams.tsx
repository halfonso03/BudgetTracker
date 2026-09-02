import { memo, type ChangeEvent, type FocusEvent } from 'react';
import CheckBoxList from '../../components/CheckBoxList';
import NumericInputUncontrolled from '../../components/NumericInputUncontrolled';
import Select from '../../components/Select';

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';

type Props = {
  initiatives?: { id: number; name: string }[] | undefined;
  grants?: { id: number; name: string }[] | undefined;
  categories?: { id: number; name: string }[] | undefined;
  onListCheck?: (id: number, key: string) => void;
  onYearChange: (year: number) => void;
  onStatusChange?: (year: number) => void;
  onAmountBlur: (amount: string, key: string) => void;
  onAmountComparerChange: (value: number, key: string) => void;
};

const ReproParams = memo(
  ({
    initiatives,
    grants,
    categories,
    onListCheck,
    onYearChange,
    onStatusChange,
    onAmountBlur,
    onAmountComparerChange,
  }: Props) => {
    function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
      onYearChange(+e.target.value);
    }

    function handleCheck(id: number, type: string) {
      onListCheck?.(id, type);
    }

    function handleAmountBlur(e: FocusEvent<HTMLInputElement>, key: string) {
      onAmountBlur(e.target.value, key);
    }

    function handleComparerChange(value: number, key: string) {
      onAmountComparerChange(value, key);
    }

    return (
      <div className="flex flex-col">
        <div className="flex gap-3 border border-b-0 border-neutral-200 p-2 rounded-t-md">
          <div className="font-semibold text-neutral-600 ml-1 self-center">
            Year:
          </div>
          <Select id="year-select" onChange={handleYearChange}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>
        <div className="border border-b-0 border-neutral-200 ">
          {initiatives !== undefined && initiatives.length > 0 && (
            <CheckBoxList
              label="Initiative:"
              id={INITIATIVES_LIST_TYPE}
              onCheck={handleCheck}
              items={initiatives.map((i) => ({ ...i, checked: true }))}
            ></CheckBoxList>
          )}
        </div>

        <div className="border border-b-0 border-neutral-200 ">
          {grants !== undefined && grants.length > 0 && (
            <CheckBoxList
              key={grants[0].name}
              label="Award:"
              id={GRANTS_LIST_TYPE}
              onCheck={handleCheck}
              items={grants.map((i) => ({ ...i, checked: true }))}
            ></CheckBoxList>
          )}
        </div>

        <div className="border border-b-0 border-neutral-200 ">
          {categories !== undefined && categories.length > 0 && (
            <CheckBoxList
              label="Account:"
              maxHeight={160}
              id={ACCOUNTS_LIST_TYPE}
              onCheck={handleCheck}
              items={categories.map((i) => ({ ...i, checked: true }))}
            ></CheckBoxList>
          )}
        </div>
        <div className="border border-b-0 border-neutral-200 pl-2 py-2 flex gap-3 pr-2">
          <div className="font-semibold text-neutral-600 ml-1 self-center">
            Status:
          </div>
          <Select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onStatusChange?.(+e.target.value)
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                handleComparerChange(+e.target.value, 'debit');
              }}
            >
              <option value="0">Less than</option>
              <option value="1">Greater Than</option>
              <option value="2">Equal To</option>
            </Select>
            <NumericInputUncontrolled
              className="border border-neutral-300 p-1 rounded-md text-end "
              placeholder="Amount..."
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                handleComparerChange(+e.target.value, 'credit');
              }}
            >
              <option value="0">Less than</option>
              <option value="1">Greater Than</option>
              <option value="2">Equal To</option>
            </Select>
            <NumericInputUncontrolled
              className="border border-neutral-300 p-1 rounded-md text-end "
              placeholder="Amount..."
              onBlur={(e) => {
                handleAmountBlur(e, 'credit');
              }}
            ></NumericInputUncontrolled>
          </div>
        </div>
      </div>
    );
  },
);
export default ReproParams;
