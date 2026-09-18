import { memo, useEffect, useRef, useState } from 'react';
import CheckBoxListReproSearchParam from '../../components/CheckBoxListReproSearchParam';
import RadioButtonList from '../../components/RadioButtonList';
import ReproSearchFilter from './ReproSearchFilter';

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
    console.log('ReproParams2 render');
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
    const [iLabel, setILabel] = useState('Initiative');
    const [gLabel, setGLabel] = useState('Grant');
    const [aLabel, setALabel] = useState('Account');
    const [selectedStatus, setSelectedStatus] = useState(statuses[0].id);
    const [statusVisible, setStatusVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);

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

    function handleStatusOutsideCLick() {
      setStatusVisible(false);
    }

    function handleYearOutsideCLick() {
      setYearVisible(false);
    }

    return (
      <div className="flex justify-center gap-3">
        <ReproSearchFilter
          usaOutsideShowList={true}
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
          usaOutsideShowList={true}
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
            usaOutsideShowList={false}
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
              <button className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer">
                Apply
              </button>
            </div>
          </ReproSearchFilter>
        )}

        {grants !== undefined && grants.length > 0 && (
          <ReproSearchFilter
            selectedItemLabel={gLabel}
            usaOutsideShowList={false}
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
              <button
                className="bg-blue-600 text-neutral-50 p-1 rounded-sm m-2 font-semibold cursor-pointer"
                onClick={() =>
                  setVisisble((prev) => ({ ...prev, grants: false }))
                }
              >
                Apply
              </button>
            </div>
          </ReproSearchFilter>
        )}

        {accounts !== undefined && accounts.length > 0 && (
          <ReproSearchFilter
            selectedItemLabel={aLabel}
            usaOutsideShowList={false}
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
