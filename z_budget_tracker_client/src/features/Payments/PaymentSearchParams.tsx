import { memo, useState } from 'react';
import RadioButtonList from '../../components/RadioButtonList';
import PaymentSearchFilter from './PaymentSearchFilter';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CheckBoxListSearchParam from '../../components/CheckBoxListSearchParam';

const YEARS_LIST_TYPE = 'Y';
const STATUS_LIST_TYPE = 'S';
const PAYEE_LIST_TYPE = 'P';
const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';
const DAYS_LIST_TYPE = 'D';

type RadioOption = {
  id: number;
  name: string;
  checked: boolean;
};
type Props = {
  years: { id: number; name: string }[];
  daysAgo: { id: number; name: string }[];
  onYearChange: (year: number) => void;
  onStatusChange: (id: number) => void;
  onDaysChange: (id: number) => void;
  onListCheck?: (id: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;
  initiatives?: { id: number; name: string }[] | undefined;
  grants?: { id: number; name: string }[] | undefined;
  accounts?: { id: number; name: string }[] | undefined;
  payees: { id: number; name: string }[] | undefined;
};

const PaymentSearchParams = memo(
  ({
    onYearChange,
    onListCheck,
    onStatusChange,
    onDaysChange,
    onSelectAll,
    onDeselectAll,
    years,
    daysAgo,
    payees,
    initiatives,
    grants,
    accounts,
  }: Props) => {
    const statuses = getStatuses();
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

    const [daysAgoOptions, setDaysAgoOptions] = useState<RadioOption[]>(() =>
      daysAgo.map((y) => ({
        id: +y.id,
        name: y.name,
        checked: y.id === daysAgo[0].id,
      })),
    );

    const [pLabel, setPLabel] = useState('Payee');
    const [iLabel, setILabel] = useState('Initiative');
    const [gLabel, setGLabel] = useState('Grant');
    const [aLabel, setALabel] = useState('Account');

    const [selectedYear, setSelectedYear] = useState(years[0].id);
    const [selectedStatus, setSelectedStatus] = useState(statuses[0].id);
    const [selectedDaysAgo, setSelectedDaysAgo] = useState(0);

    const [statusVisible, setStatusVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [daysAgoFilterVisible, setDaysAgoFilterVisible] =
      useState<boolean>(false);

    function handleStatusChange(id: number) {
      setSelectedStatus(id);
      onStatusChange(id);
    }

    function handleYearSelected(id: number) {
      setSelectedYear(id);
      setYearOptions((prev) =>
        prev.map((y) => ({ ...y, checked: y.id === id })),
      );

      onYearChange(id);
    }

    function handleDaysSelected(id: number) {
      setSelectedDaysAgo(id);
      setDaysAgoOptions((prev) =>
        prev.map((y) => ({ ...y, checked: y.id === id })),
      );

      onDaysChange(id);
    }

    function handleCheck(id: number, type: string) {
      onListCheck?.(id, type);
    }

    function handleDeselectAll(type: string) {
      onDeselectAll(type);
    }

    function handleSelectAll(type: string) {
      onSelectAll(type);
      if (type == PAYEE_LIST_TYPE) {
        setPLabel('Payee');
      } else if (type == INITIATIVES_LIST_TYPE) {
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
      if (type == PAYEE_LIST_TYPE) {
        if (
          options.filter((x) => x.checked).length === 0 ||
          payees?.length === options.filter((x) => x.checked).length
        ) {
          setPLabel('Payee');
        } else {
          setPLabel('Payee (' + options.filter((x) => x.checked).length + ')');
        }
      }
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
      setDaysAgoFilterVisible((prev) => !prev);
    }

    function handleStatusOutsideCLick() {
      setStatusVisible(false);
    }

    function handleYearOutsideCLick() {
      setYearVisible(false);
    }

    function handleAmountFilterOutsideClick() {
      setDaysAgoFilterVisible(false);
    }

    return (
      <div className=" flex justify-center items-center gap-3 z-10 w-full">
        <PaymentSearchFilter
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
        </PaymentSearchFilter>
        <PaymentSearchFilter
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
        </PaymentSearchFilter>

        <PaymentSearchFilter
          selectedItemLabel={
            selectedDaysAgo === 0
              ? 'Paid Less...'
              : daysAgo.filter((x) => x.id == selectedDaysAgo)[0].name
          }
          parentCorntrolled={true}
          outsideShowList={daysAgoFilterVisible}
          listOpened={handleAmountFilterOpened}
          outsideClicked={handleAmountFilterOutsideClick}
        >
          <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-50 rounded-md mt-1 z-1000 opacity-100 bg-white">
            <RadioButtonList
              id={DAYS_LIST_TYPE}
              onSelected={handleDaysSelected}
              items={daysAgoOptions}
            ></RadioButtonList>
            <button
              className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
              onClick={() => {
                setDaysAgoFilterVisible(false);
              }}
            >
              Apply
            </button>
          </div>
        </PaymentSearchFilter>

        {!payees && (
          <div className="flex gap-3 w-[30%]">
            <Skeleton
              height={40}
              className="mt-0 self-center p-1 flex-1"
              enableAnimation={true}
              containerClassName="flex-1"
            />
            <Skeleton
              height={40}
              className="mt-0 self-center p-1 flex-1"
              enableAnimation={true}
              containerClassName="flex-1"
            />
            <Skeleton
              height={40}
              className="mt-0 self-center p-1 flex-1"
              enableAnimation={true}
              containerClassName="flex-1"
            />
            <Skeleton
              height={40}
              className="mt-0 self-center p-1 flex-1"
              enableAnimation={true}
              containerClassName="flex-1"
            />
          </div>
        )}

        {payees !== undefined && payees.length > 0 && (
          <PaymentSearchFilter
            selectedItemLabel={pLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListSearchParam
                id={PAYEE_LIST_TYPE}
                onCheck={handleCheck}
                maxHeight={400}
                items={payees.map((i) => ({
                  ...i,
                  checked: true,
                  xChecked: false,
                }))}
                onDeselectAll={handleDeselectAll}
                onSelectAll={handleSelectAll}
                onOptionsUpdated={(o) =>
                  handleOptionsUpdated(o, PAYEE_LIST_TYPE)
                }
                showExclusiveOptions={false}
              ></CheckBoxListSearchParam>
            </div>
          </PaymentSearchFilter>
        )}

        {initiatives !== undefined && initiatives.length > 0 && (
          <PaymentSearchFilter
            selectedItemLabel={iLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListSearchParam
                id={INITIATIVES_LIST_TYPE}
                onCheck={handleCheck}
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
              ></CheckBoxListSearchParam>
            </div>
          </PaymentSearchFilter>
        )}

        {grants !== undefined && grants.length > 0 && (
          <PaymentSearchFilter
            selectedItemLabel={gLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListSearchParam
                key={selectedYear}
                id={GRANTS_LIST_TYPE}
                onCheck={handleCheck}
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
              ></CheckBoxListSearchParam>
            </div>
          </PaymentSearchFilter>
        )}

        {accounts !== undefined && accounts.length > 0 && (
          <PaymentSearchFilter
            selectedItemLabel={aLabel}
            parentCorntrolled={false}
            outsideShowList={false}
          >
            <div className="flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white">
              <CheckBoxListSearchParam
                id={ACCOUNTS_LIST_TYPE}
                onCheck={handleCheck}
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
              ></CheckBoxListSearchParam>
            </div>
          </PaymentSearchFilter>
        )}
      </div>
    );
  },
);

export default PaymentSearchParams;

function getStatuses(): RadioOption[] {
  return [
    { id: 0, name: 'All Statuses', checked: true },
    { id: 1, name: 'Saved', checked: false },
    { id: 2, name: 'Posted', checked: false },
  ];
}
