import { memo, type ChangeEvent, type FocusEvent } from 'react';
import NumericInputUncontrolled from '../../components/NumericInputUncontrolled';
import Select from '../../components/Select';
import CheckBoxListReproSearchParam from '../../components/CheckBoxListReproSearchParam';

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';

type Props = {
  initiatives?: { id: number; name: string }[] | undefined;
  grants?: { id: number; name: string }[] | undefined;
  accounts?: { id: number; name: string }[] | undefined;
  onListCheck?: (id: number, key: string) => void;
  onListXCheck?: (id: number, key: string) => void;
  onYearChange: (year: number) => void;
  onStatusChange?: (year: number) => void;
  onAmountBlur: (amount: string, key: string) => void;
  onAmountComparerChange: (value: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;
};

const ReproParams = memo(
  ({
    initiatives,
    grants,
    accounts,
    onListCheck,
    onListXCheck,
    onYearChange,
    onStatusChange,
    onAmountBlur,
    onAmountComparerChange,
    onDeselectAll,
    onSelectAll,
  }: Props) => {
    
    function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
      onYearChange(+e.target.value);
    }

    function handleCheck(id: number, type: string) {
      onListCheck?.(id, type);
    }

    function handleXCheck(id: number, type: string) {
      onListXCheck?.(id, type);
    }

    function handleAmountBlur(e: FocusEvent<HTMLInputElement>, key: string) {
      onAmountBlur(e.target.value, key);
    }

    function handleComparerChange(value: number, key: string) {
      onAmountComparerChange(value, key);
    }

    function handleDeselectAll(type: string) {
      onDeselectAll(type);
    }

    function handleSelectAll(type: string) {
      onSelectAll(type);
    }

    return (
      <div className="flex flex-col">
        <div className="flex gap-3 border border-b-0 border-neutral-200 p-2 py-3 rounded-t-md">
          <div className="font-semibold text-neutral-600 ml-1 self-center">
            Year
          </div>
          <Select id="year-select" onChange={handleYearChange}>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Select>
        </div>
        <div className="border border-b-0 border-neutral-200 ">
          {initiatives !== undefined && initiatives.length > 0 && (
            <CheckBoxListReproSearchParam
              label="Initiative"
              id={INITIATIVES_LIST_TYPE}
              onCheck={handleCheck}
              onXCheck={handleXCheck}
              items={initiatives.map((i) => ({
                ...i,
                checked: true,
                xChecked: false,
              }))}
              onDeselectAll={handleDeselectAll}
              onSelectAll={handleSelectAll}
            ></CheckBoxListReproSearchParam>
          )}
        </div>

        <div className="border border-b-0 border-neutral-200 ">
          {grants !== undefined && grants.length > 0 && (
            <CheckBoxListReproSearchParam
              key={grants[0].name}
              label="Award"
              id={GRANTS_LIST_TYPE}
              onCheck={handleCheck}
              onXCheck={handleXCheck}
              items={grants.map((i) => ({
                ...i,
                checked: true,
                xChecked: false,
              }))}
              onDeselectAll={handleDeselectAll}
              onSelectAll={handleSelectAll}
            ></CheckBoxListReproSearchParam>
          )}
        </div>

        <div className="border border-b-0 border-neutral-200 ">
          {accounts !== undefined && accounts.length > 0 && (
            <CheckBoxListReproSearchParam
              label="Account"
              id={ACCOUNTS_LIST_TYPE}
              onCheck={handleCheck}
              onXCheck={handleXCheck}
              items={accounts.map((i) => ({
                ...i,
                checked: true,
                xChecked: false,
              }))}
              onDeselectAll={handleDeselectAll}
              onSelectAll={handleSelectAll}
            ></CheckBoxListReproSearchParam>
          )}
        </div>
        <div className="border border-b-0 border-neutral-200 pl-2 py-3 flex gap-3 pr-2">
          <div className="font-semibold text-neutral-600 ml-1 self-center">
            Status
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
            Debit Amount
          </div>
          <div className="flex gap-2">
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                handleComparerChange(+e.target.value, 'debit');
              }}
            >
              <option value="0">None</option>
              <option value="1">Greater Than</option>
              <option value="2">Less than</option>
              <option value="3">Equal To</option>
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
            Credit Amount
          </div>
          <div className="flex gap-2">
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                handleComparerChange(+e.target.value, 'credit');
              }}
            >
              <option value="0">None</option>
              <option value="1">Greater Than</option>
              <option value="2">Less than</option>
              <option value="3">Equal To</option>
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
