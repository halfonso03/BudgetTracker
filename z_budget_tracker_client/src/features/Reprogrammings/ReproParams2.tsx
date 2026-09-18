import { memo, useState } from 'react';
import CheckBoxListReproSearchParam from '../../components/CheckBoxListReproSearchParam';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import RadioButtonList from '../../components/RadioButtonList';

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
};

type VisibleParams = {
  initiatives: boolean;
  grants: boolean;
  accounts: boolean;
  years: boolean;
  statuses: boolean;
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
  }: Props) => {
    // console.log('ReproParams2 render');

    const [visible, setVisisble] = useState<VisibleParams>({
      initiatives: false,
      grants: false,
      accounts: false,
      years: false,
      statuses: false,
    });

    const statuses = getStatuses();
    // const [setSelectedYear] = useState(years[0].id);

    // const [startYear, setStartYear] = useState(() => initialYear);
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
    console.log('yearOptions', yearOptions);
    const [iLabel, setILabel] = useState('Initiative');
    const [gLabel, setGLabel] = useState('Grant');
    const [aLabel, setALabel] = useState('Account');
    const [selectedStatus, setSelectedStatus] = useState(statuses[0].id);
    const gRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, grants: false }));
    }, false);
    const iRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, initiatives: false }));
    }, false);

    const aRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, accounts: false }));
    }, false);

    const yRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, years: false }));
    }, false);

    const sRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, statuses: false }));
    }, false);

    // function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {}

    function handleStatusChange(id: number) {
      setSelectedStatus(id);
      onStatusChange(id);
      setVisisble((prev) => ({
        ...prev,
        statuses: false,
      }));
    }
    function handleYearSelected(id: number) {
      // setSelectedYear(id);
      setYearOptions((prev) =>
        prev.map((y) => ({ ...y, checked: y.id === id })),
      );
      setVisisble((prev) => ({
        ...prev,
        years: false,
      }));
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

    function onListVisible(type: string) {
      if (type == INITIATIVES_LIST_TYPE) {
        setVisisble((prev) => ({
          ...prev,
          initiatives: visible.initiatives === true ? false : true,
        }));
      } else if (type == GRANTS_LIST_TYPE) {
        setVisisble((prev) => ({
          ...prev,
          grants: visible.grants === true ? false : true,
        }));
      } else if (type == ACCOUNTS_LIST_TYPE) {
        setVisisble((prev) => ({
          ...prev,
          accounts: visible.accounts === true ? false : true,
        }));
      } else if (type == YEARS_LIST_TYPE) {
        setVisisble((prev) => ({
          ...prev,
          years: visible.years === true ? false : true,
        }));
      } else if (type == STATUS_LIST_TYPE) {
        setVisisble((prev) => ({
          ...prev,
          statuses: visible.statuses === true ? false : true,
        }));
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

    return (
      <div className="flex justify-center gap-3">
        <div className="relative" ref={yRef}>
          <div className="flex">
            <button
              className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
              onClick={() => onListVisible(YEARS_LIST_TYPE)}
            >
              <div className="grow">
                {yearOptions.filter((y) => y.checked)[0].name}
              </div>
              <div>
                <ChevronUp
                  className={`${visible.years === true ? 'hidden' : ''}`}
                ></ChevronUp>
                <ChevronDown
                  className={`${visible.years === false ? 'hidden' : ''}`}
                ></ChevronDown>
              </div>
            </button>
          </div>

          <div
            className={` flex flex-col absolute shadow-lg shadow-neutral-300 w-50 rounded-md mt-1 z-1000 opacity-100 bg-white ${visible.years ? '' : 'hidden'}`}
          >
            <RadioButtonList
              id={YEARS_LIST_TYPE}
              onSelected={handleYearSelected}
              items={yearOptions}
            ></RadioButtonList>
          </div>
        </div>
        {initiatives !== undefined && initiatives.length > 0 && (
          <div className="relative" ref={iRef}>
            <div className="flex">
              <button
                className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
                onClick={() => onListVisible(INITIATIVES_LIST_TYPE)}
              >
                <div className="grow">{iLabel}</div>
                <div>
                  <ChevronUp
                    className={`${visible.initiatives === true ? 'hidden' : ''}`}
                  ></ChevronUp>
                  <ChevronDown
                    className={`${visible.initiatives === false ? 'hidden' : ''}`}
                  ></ChevronDown>
                </div>
              </button>
            </div>
            <div
              className={` flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white ${visible.initiatives ? '' : 'hidden'}`}
            >
              <CheckBoxListReproSearchParam
                id={INITIATIVES_LIST_TYPE}
                onCheck={handleCheck}
                onXCheck={handleXCheck}
                maxHeight={600}
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
              <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, initiatives: false }))
                }
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {grants !== undefined && grants.length > 0 && (
          <div className="relative" ref={gRef}>
            <div className="flex">
              <button
                className="flex justify-between rounded-md border border-neutral-300 py-2 px-3 font-semibold  cursor-pointer text-neutral-700 items-center w-35"
                onClick={() => onListVisible(GRANTS_LIST_TYPE)}
              >
                <div className="grow">{gLabel}</div>
                <div>
                  <ChevronUp
                    className={`${visible.grants === true ? 'hidden' : ''}`}
                  ></ChevronUp>
                  <ChevronDown
                    className={`${visible.grants === false ? 'hidden' : ''}`}
                  ></ChevronDown>
                </div>
              </button>
            </div>
            <div
              className={`flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white ${visible.grants ? '' : 'hidden'}`}
            >
              <CheckBoxListReproSearchParam
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
              <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, grants: false }))
                }
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {accounts !== undefined && accounts.length > 0 && (
          <div className="relative" ref={aRef}>
            <div className="flex">
              <button
                className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
                onClick={() => onListVisible(ACCOUNTS_LIST_TYPE)}
              >
                <div className="grow">{aLabel}</div>
                <div>
                  <ChevronUp
                    className={`${visible.accounts === true ? 'hidden' : ''}`}
                  ></ChevronUp>
                  <ChevronDown
                    className={`${visible.accounts === false ? 'hidden' : ''}`}
                  ></ChevronDown>
                </div>
              </button>
            </div>
            <div
              className={` flex flex-col absolute shadow-lg shadow-neutral-300 w-100 rounded-md mt-1 z-1000 opacity-100 bg-white ${visible.accounts ? '' : 'hidden'}`}
            >
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
              <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, accounts: false }))
                }
              >
                Apply
              </button>
            </div>
          </div>
        )}
        <div className="relative" ref={sRef}>
          <div className="flex">
            <button
              className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
              onClick={() => onListVisible(STATUS_LIST_TYPE)}
            >
              <div className="grow">
                {statuses.filter((x) => x.id == selectedStatus)[0].name}
              </div>
              <div>
                <ChevronUp
                  className={`${visible.statuses === true ? 'hidden' : ''}`}
                ></ChevronUp>
                <ChevronDown
                  className={`${visible.statuses === false ? 'hidden' : ''}`}
                ></ChevronDown>
              </div>
            </button>
          </div>

          <div
            className={` flex flex-col absolute shadow-lg shadow-neutral-300 w-50 rounded-md mt-1 z-1000 opacity-100 bg-white ${visible.statuses ? '' : 'hidden'}`}
          >
            <RadioButtonList
              id={STATUS_LIST_TYPE}
              onSelected={handleStatusChange}
              items={statuses.map((y) => ({
                ...y,
                checked: selectedStatus === y.id,
              }))}
            ></RadioButtonList>
          </div>
        </div>
      </div>
    );
  },
);

export default ReproParams2;

// function getYears(): {
//   id: number;
//   name: string;
//   checked: boolean;
// }[] {
//   return [
//     { id: 2026, name: '2026', checked: true },
//     { id: 2025, name: '2025', checked: false },
//   ];
// }

function getStatuses(): {
  id: number;
  name: string;
  checked: boolean;
}[] {
  return [
    { id: 0, name: 'All', checked: true },
    { id: 1, name: 'Saved', checked: false },
    { id: 2, name: 'Posted', checked: false },
  ];
}
