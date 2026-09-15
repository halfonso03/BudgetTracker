import { memo, useState, type ChangeEvent } from 'react';
import CheckBoxListReproSearchParam from '../../components/CheckBoxListReproSearchParam';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import Select from '../../components/Select';

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';

type Props = {
  initiatives?: { id: number; name: string }[] | undefined;
  grants?: { id: number; name: string }[] | undefined;
  accounts?: { id: number; name: string }[] | undefined;

  onYearChange: (year: number) => void;

  onListCheck?: (id: number, key: string) => void;
  onListXCheck?: (id: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;
};

type VisibleParams = {
  initiatives: boolean;
  grants: boolean;
  accounts: boolean;
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
  }: Props) => {
    const [visible, setVisisble] = useState<VisibleParams>({
      initiatives: false,
      grants: false,
      accounts: false,
    });

    const gRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, grants: false }));
    }, false);

    const iRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, initiatives: false }));
    }, false);

    const aRef = useOutsideClick<HTMLDivElement>(() => {
      setVisisble((prev) => ({ ...prev, accounts: false }));
    }, false);

    function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
      onYearChange(+e.target.value);
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
        setVisisble({
          grants: false,
          accounts: false,
          initiatives: visible.initiatives === true ? false : true,
        });
      } else if (type == GRANTS_LIST_TYPE) {
        setVisisble({
          initiatives: false,
          accounts: false,
          grants: visible.grants === true ? false : true,
        });
      } else if (type == ACCOUNTS_LIST_TYPE) {
        setVisisble({
          initiatives: false,
          grants: false,
          accounts: visible.accounts === true ? false : true,
        });
      }
    }

    const [iLabel, setILabel] = useState('Initiative');
    const [gLabel, setGLabel] = useState('Grant');
    const [aLabel, setALabel] = useState('Account');

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
        if (options.filter((x) => x.checked).length === 0) {
          setILabel('Initiative');
        } else if (
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
        if (options.filter((x) => x.checked).length === 0) {
          setGLabel('Grant');
        } else if (grants?.length === options.filter((x) => x.checked).length) {
          setGLabel('Grant');
        } else {
          setGLabel('Grant (' + options.filter((x) => x.checked).length + ')');
        }
      }
      if (type == ACCOUNTS_LIST_TYPE) {
        if (options.filter((x) => x.checked).length === 0) {
          setALabel('Account');
        } else if (
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
        <div className="flex gap-3 border  rounded-md py-2 px-3">
          <div className="font-semibold text-neutral-600 self-center p-0">
            Year
          </div>
          <Select
            id="year-select"
            onChange={handleYearChange}
            additionalclasses="border-0 p-0"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Select>
        </div>
        {initiatives !== undefined && initiatives.length > 0 && (
          <div className="relative" ref={iRef}>
            <div className="flex">
              <button
                className="rounded-md border-2 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
                onClick={() => onListVisible(INITIATIVES_LIST_TYPE)}
              >
                <div className="grow">{iLabel}</div>
                <div>
                  {visible.initiatives === true ? (
                    <ChevronUp></ChevronUp>
                  ) : (
                    <ChevronDown></ChevronDown>
                  )}
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
                className="flex justify-between rounded-md border-2 py-2 px-3 font-semibold  cursor-pointer text-neutral-700 items-center w-35"
                onClick={() => onListVisible(GRANTS_LIST_TYPE)}
              >
                <div className="grow">{gLabel}</div>
                <div>
                  {visible.grants === true ? (
                    <ChevronUp></ChevronUp>
                  ) : (
                    <ChevronDown></ChevronDown>
                  )}
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
                className="rounded-md border-2 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
                onClick={() => onListVisible(ACCOUNTS_LIST_TYPE)}
              >
                <div className="grow">{aLabel}</div>
                <div>
                  {visible.accounts === true ? (
                    <ChevronUp></ChevronUp>
                  ) : (
                    <ChevronDown></ChevronDown>
                  )}
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
      </div>
    );
  },
);

export default ReproParams2;
