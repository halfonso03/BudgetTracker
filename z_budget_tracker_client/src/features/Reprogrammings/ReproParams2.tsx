import {
  memo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import CheckBoxListReproSearchParam from '../../components/CheckBoxListReproSearchParam';
import RadioButtonList from '../../components/RadioButtonList';
import ReproSearchFilter from './ReproSearchFilter';
import NumericInputUncontrolled from '../../components/NumericInputUncontrolled';
import { parseFormattedNumber } from '../../app/util';

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';
const YEARS_LIST_TYPE = 'Y';
const STATUS_LIST_TYPE = 'S';

type Props = {
  initiatives?: { id: number; name: string }[] | undefined;
  grants?: { id: number; name: string }[] | undefined;
  accounts?: { id: number; name: string }[] | undefined;
  years: { id: number; name: string }[];
  onYearChange: (year: number) => void;
  onStatusChange: (id: number) => void;
  onListCheck?: (id: number, key: string) => void;
  onListXCheck?: (id: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;
  onAmountFilter: (amountFilter: ReproAmountFilter) => void;
  onAmountFilterCancel: () => void;
};

const ReproParams2 = memo(
  ({
    initiatives,
    grants,
    accounts,
    onYearChange,
    onListCheck,
    onListXCheck,
    onDeselectAll,
    onSelectAll,
    onStatusChange,
    years,
    onAmountFilter,
    onAmountFilterCancel,
  }: Props) => {
    console.log('ReproParams2 render');
    const statuses = getStatuses();

    const debitRef = useRef<HTMLInputElement | null>(null);
    const creditRef = useRef<HTMLInputElement | null>(null);
    const [yearOptions, setYearOptions] = useState<
      {
        id: number;
        name: string;
        checked: boolean;
      }[]
    >(() =>
      years.map((y) => ({
        id: +y.id,
        name: y.name,
        checked: y.id === years[0].id,
      })),
    );
    const [iLabel, setILabel] = useState('Initiative');
    const [gLabel, setGLabel] = useState('Grant');
    const [aLabel, setALabel] = useState('Account');
    const [selectedStatus, setSelectedStatus] = useState(statuses[0].id);
    const [statusVisible, setStatusVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [amountFilterVisible, setAmountFilterVisible] = useState(false);
    const [amountFilter, setAmountFilter] = useState<ReproAmountFilter>({
      debitAmount: 0,
      creditAmount: 0,
      debitComparer: 0,
      creditComparer: 0,
    });
    const [amountFilterLabel, setAmountFilterLabel] = useState('$');

    function handleStatusChange(id: number) {
      setSelectedStatus(id);
      onStatusChange(id);
    }

    const [selectedYear, setSelectedYear] = useState(years[0].id);

    function handleYearSelected(id: number) {
      setSelectedYear(id);
      setYearOptions((prev) =>
        prev.map((y) => ({ ...y, checked: y.id === id })),
      );

      onYearChange(id);
    }

    function handleCheck(id: number, type: string) {
      onListCheck?.(id, type);
    }

    function handleXCheck(id: number, type: string) {
      onListXCheck?.(id, type);
    }

    function handleDeselectAll(type: string) {
      onDeselectAll(type);
    }

    function handleSelectAll(type: string) {
      onSelectAll(type);
      if (type == INITIATIVES_LIST_TYPE) {
        setILabel('Initiative');
      } else if (type == GRANTS_LIST_TYPE) {
        setGLabel('Grant');
      } else if (type == ACCOUNTS_LIST_TYPE) {
        setALabel('Account');
      }
    }

    function handleOptionsUpdated(
      options: {
        id: number;
        name: string;
        checked: boolean;
        xChecked: boolean;
      }[],
      type: string,
    ) {
      if (type == INITIATIVES_LIST_TYPE) {
        if (
          options.filter((x) => x.checked).length === 0 ||
          initiatives?.length === options.filter((x) => x.checked).length
        ) {
          setILabel('Initiative');
        } else {
          setILabel(
            'Initiative (' + options.filter((x) => x.checked).length + ')',
          );
        }
      }
      if (type == GRANTS_LIST_TYPE) {
        if (
          options.filter((x) => x.checked).length === 0 ||
          grants?.length === options.filter((x) => x.checked).length
        ) {
          setGLabel('Grant');
        } else {
          setGLabel('Grant (' + options.filter((x) => x.checked).length + ')');
        }
      }
      if (type == ACCOUNTS_LIST_TYPE) {
        if (
          options.filter((x) => x.checked).length === 0 ||
          accounts?.length === options.filter((x) => x.checked).length
        ) {
          setALabel('Account');
        } else {
          setALabel(
            'Account (' + options.filter((x) => x.checked).length + ')',
          );
        }
      }
    }

    function handleStatusOpened() {
      setStatusVisible((prev) => !prev);
    }

    function handleYearOpened() {
      setYearVisible((prev) => !prev);
    }

    function handleAmountFilterOpened() {
      setAmountFilterVisible((prev) => !prev);
    }

    function handleStatusOutsideCLick() {
      setStatusVisible(false);
    }

    function handleYearOutsideCLick() {
      setYearVisible(false);
    }

    function handleAmountFilterOutsideClick() {
      setAmountFilterVisible(false);
    }

    function handleAmountFilter() {
      setAmountFilterVisible(false);
      onAmountFilter(amountFilter);

      const valueCount =
        (amountFilter.debitAmount !== 0 ? 1 : 0) +
        (amountFilter.creditAmount !== 0 ? 1 : 0) +
        (amountFilter.debitComparer !== 0 ? 1 : 0) +
        (amountFilter.creditComparer !== 0 ? 1 : 0);
      setAmountFilterLabel(valueCount == 0 ? '$' : valueCount + ' input(s)');
    }

    function handleAmountFilterCancel() {
      debitRef!.current!.value = '';
      creditRef!.current!.value = '';
      setAmountFilter({
        debitAmount: 0,
        creditAmount: 0,
        debitComparer: 0,
        creditComparer: 0,
      });

      setAmountFilterVisible(false);
      setAmountFilterLabel('$');
      onAmountFilterCancel();
    }

    function handleDebitBlur(e: ChangeEvent<HTMLInputElement>) {
      const amount = parseFormattedNumber(e.target.value);
      setAmountFilter((prev) => ({ ...prev, debitAmount: amount }));
    }

    function handleCreditBlur(e: ChangeEvent<HTMLInputElement>) {
      const amount = parseFormattedNumber(e.target.value);
      setAmountFilter((prev) => ({ ...prev, creditAmount: amount }));
    }

    function handleDebitComparerChange(e: ChangeEvent<HTMLSelectElement>) {
      const value = +e.target.value;
      if (value == 0) debitRef!.current!.value = '0';

      setAmountFilter((prev) => ({
        ...prev,
        debitAmount: value == 0 ? prev.debitAmount : 0,
        debitComparer: value,
      }));
    }

    function handleCreditComparerChange(e: ChangeEvent<HTMLSelectElement>) {
      const value = +e.target.value;
      if (value == 0) creditRef!.current!.value = '0';
      setAmountFilter((prev) => ({
        ...prev,
        creditAmount: value == 0 ? 0 : prev.creditAmount,
        creditCompare: value,
      }));
    }

    return (
      <div className="flex justify-center gap-3">
        <ReproSearchFilter
          selectedItemLabel={amountFilterLabel}
          parentCorntrolled={true}
          outsideShowList={amountFilterVisible}
          listOpened={handleAmountFilterOpened}
          outsideClicked={handleAmountFilterOutsideClick}
        >
          <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-80 rounded-md mt-1 z-1000 opacity-100 bg-white">
            <div className="border border-b-0 border-neutral-200 p-2 py-3">
              <div className="font-semibold text-neutral-600 ml-1">
                Debit Amount
              </div>
              <div className="flex gap-2">
                <select
                  className="border p-2 border-neutral-300 rounded-sm text-neutral-800 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-90 disabled:bg-neutral-200"
                  value={amountFilter.debitComparer}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    handleDebitComparerChange(e);
                    setAmountFilter(() => ({
                      ...amountFilter,
                      debitComparer: +e.target.value,
                    }));
                  }}
                >
                  <option value="0">None</option>
                  <option value="1">Greater Than</option>
                  <option value="2">Less than</option>
                  <option value="3">Equal To</option>
                </select>
                <NumericInputUncontrolled
                  className="border border-neutral-300 p-1 rounded-md text-end "
                  placeholder="Amount..."
                  ref={debitRef}
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    handleDebitBlur(e);
                  }}
                ></NumericInputUncontrolled>
              </div>
            </div>
            <div className="border border-neutral-200 p-2 py-3">
              <div className="font-semibold text-neutral-600 ml-1">
                Credit Amount
              </div>
              <div className="flex gap-2">
                <select
                  className="border p-2 border-neutral-300 rounded-sm text-neutral-800 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-90 disabled:bg-neutral-200"
                  value={amountFilter.creditComparer}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    handleCreditComparerChange(e);
                    setAmountFilter(() => ({
                      ...amountFilter,
                      creditComparer: +e.target.value,
                    }));
                  }}
                >
                  <option value="0">None</option>
                  <option value="1">Greater Than</option>
                  <option value="2">Less than</option>
                  <option value="3">Equal To</option>
                </select>
                <NumericInputUncontrolled
                  className="border border-neutral-300 p-1 rounded-md text-end "
                  placeholder="Amount..."
                  ref={creditRef}
                  onBlur={(e) => {
                    handleCreditBlur(e);
                  }}
                ></NumericInputUncontrolled>
              </div>
            </div>
            <div className="flex gap-2 p-2">
              <button
                className="flex-1 bg-blue-600 text-neutral-50 p-1 rounded-sm font-semibold cursor-pointer"
                onClick={handleAmountFilter}
              >
                Apply
              </button>
              <button
                className="flex-1 border border-neutral-200 bg-neutral-50 text-blue-500 p-1 rounded-sm font-semibold cursor-pointer"
                onClick={handleAmountFilterCancel}
              >
                Clear
              </button>
            </div>
          </div>
        </ReproSearchFilter>

        <ReproSearchFilter
          parentCorntrolled={true}
          outsideShowList={yearVisible}
          listOpened={handleYearOpened}
          outsideClicked={handleYearOutsideCLick}
          selectedItemLabel={yearOptions.filter((y) => y.checked)[0].name}
        >
          <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-50 rounded-md mt-1 z-1000 opacity-100 bg-white">
            <RadioButtonList
              id={YEARS_LIST_TYPE}
              onSelected={handleYearSelected}
              items={yearOptions}
            ></RadioButtonList>
            <button
              className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
              onClick={() => {
                setYearVisible(false);
              }}
            >
              Apply
            </button>
          </div>
        </ReproSearchFilter>

        <ReproSearchFilter
          parentCorntrolled={true}
          outsideShowList={statusVisible}
          listOpened={handleStatusOpened}
          outsideClicked={handleStatusOutsideCLick}
          selectedItemLabel={
            statuses.filter((x) => x.id == selectedStatus)[0].name
          }
        >
          <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-50 rounded-md mt-1 z-1000 opacity-100 bg-white">
            <RadioButtonList
              id={STATUS_LIST_TYPE}
              onSelected={handleStatusChange}
              items={statuses.map((y) => ({
                ...y,
                checked: selectedStatus === y.id,
              }))}
            ></RadioButtonList>
            <button
              className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
              onClick={() => {
                setStatusVisible(false);
              }}
            >
              Apply
            </button>
          </div>
        </ReproSearchFilter>

        {initiatives !== undefined && initiatives.length > 0 && (
          <ReproSearchFilter
            selectedItemLabel={iLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListReproSearchParam
                id={INITIATIVES_LIST_TYPE}
                onCheck={handleCheck}
                onXCheck={handleXCheck}
                maxHeight={400}
                items={initiatives.map((i) => ({
                  ...i,
                  checked: true,
                  xChecked: false,
                }))}
                onDeselectAll={handleDeselectAll}
                onSelectAll={handleSelectAll}
                onOptionsUpdated={(o) =>
                  handleOptionsUpdated(o, INITIATIVES_LIST_TYPE)
                }
              ></CheckBoxListReproSearchParam>
              {/* <button className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer">
                Apply
              </button> */}
            </div>
          </ReproSearchFilter>
        )}

        {grants !== undefined && grants.length > 0 && (
          <ReproSearchFilter
            selectedItemLabel={gLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListReproSearchParam
                key={selectedYear}
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
                onOptionsUpdated={(o) =>
                  handleOptionsUpdated(o, GRANTS_LIST_TYPE)
                }
              ></CheckBoxListReproSearchParam>
              {/* <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, grants: false }))
                }
              >
                Apply
              </button> */}
            </div>
          </ReproSearchFilter>
        )}

        {accounts !== undefined && accounts.length > 0 && (
          <ReproSearchFilter
            selectedItemLabel={aLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListReproSearchParam
                id={ACCOUNTS_LIST_TYPE}
                onCheck={handleCheck}
                onXCheck={handleXCheck}
                maxHeight={600}
                items={accounts.map((i) => ({
                  ...i,
                  checked: true,
                  xChecked: false,
                }))}
                onDeselectAll={handleDeselectAll}
                onSelectAll={handleSelectAll}
                onOptionsUpdated={(o) =>
                  handleOptionsUpdated(o, ACCOUNTS_LIST_TYPE)
                }
              ></CheckBoxListReproSearchParam>
              {/* <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, accounts: false }))
                }
              >
                Apply
              </button> */}
            </div>
          </ReproSearchFilter>
        )}
      </div>
    );
  },
);

export default ReproParams2;

function getStatuses(): {
  id: number;
  name: string;
  checked: boolean;
}[] {
  return [
    { id: 0, name: 'All Statuses', checked: true },
    { id: 1, name: 'Saved', checked: false },
    { id: 2, name: 'Posted', checked: false },
  ];
}
