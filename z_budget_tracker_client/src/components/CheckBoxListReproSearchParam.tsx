import { useState } from 'react';

type Props = {
  id: string;
  label?: string;
  maxHeight?: number | null | undefined;
  items: { id: number; name: string; checked: boolean; xChecked: boolean }[];
  onCheck: (id: number, key: string) => void;
  onXCheck?: (id: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;
  onOptionsUpdated: (
    options: {
      id: number;
      name: string;
      checked: boolean;
      xChecked: boolean;
    }[],
  ) => void;
};

const CheckBoxListReproSearchParam = ({
  label,
  items,
  id,
  maxHeight,
  onCheck,
  onXCheck,
  onDeselectAll,
  onSelectAll,
  onOptionsUpdated,
}: Props) => {
  const [allSelected, setAllSelected] = useState(true);

  const [options, setOptions] = useState<
    { id: number; name: string; checked: boolean; xChecked: boolean }[]
  >(
    items.map((i) => ({
      id: i.id,
      name: i.name,
      checked: i.checked,
      xChecked: i.xChecked,
    })),
  );

  const overflowClass =
    maxHeight !== null && maxHeight !== undefined
      ? ` overflow-y-auto`
      : '' + ' ';

  function handleCheck(id: number, key: string) {
    const removed = options.some((x) => x.id == id && x.checked);

    const newOptions = options.map((i) => ({
      ...i,
      checked: i.id === id ? !i.checked : i.checked,
      xChecked: i.id === id && removed ? false : i.xChecked,
    }));

    if (options.length === newOptions.filter((x) => x.checked).length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }

    setOptions(newOptions);
    onOptionsUpdated(newOptions);
    onCheck(id, key);
  }

  function handleXCheck(id: number, key: string) {
    setOptions((prev) => {
      return prev.map((i) => ({
        ...i,
        xChecked: i.id === id ? !i.xChecked : i.xChecked,
      }));
    });
    onXCheck?.(id, key);
  }

  function deselectAllClick() {
    if (allSelected) {
      setOptions((prev) => [
        ...prev.map((i) => ({ ...i, checked: false, xChecked: false })),
      ]);
      setAllSelected(false);
      onDeselectAll(id);
    } else {
      setAllSelected(true);
      setOptions((prev) => [...prev.map((i) => ({ ...i, checked: true }))]);
      onSelectAll(id);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between font-medium text-neutral-600 dark:text-white bg-neutral-50 dark:bg-slate-900 rounded-xl border-b border-b-neutral-200 dark:border-b-slate-800  ">
        <div className="flex bg-neutral-200/60 dark:bg-slate-800 p-2">
          <div className="pl-2 flex-1 dark:text-slate-300 ">{label}</div>
          <div className="pr-2 ">
            <button
              className="text-blue-600 dark:text-slate-100 cursor-pointer"
              onClick={deselectAllClick}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        <div
          className={overflowClass + ' '}
          style={{
            maxHeight:
              maxHeight !== null && maxHeight !== undefined
                ? maxHeight + 'px'
                : '',
            padding: '4px',
          }}
        >
          <ul className='p-1'>
            {options?.map((i, index) => {
              return (
                <li
                  key={index}
                  className="grid grid-cols-[2fr_1fr] p-1 text-neutral-700 dark:text-slate-500"
                >
                  <div className="flex gap-2">
                    <div>
                      <div className="relative flex ">
                        <input
                          type="checkbox"
                          onChange={() => {
                            handleCheck(i.id, id);
                          }}
                          checked={i.checked}
                          className={`peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700 dark:checked:bg-slate-700 dark:checked:border-indigio-300 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-indigo-400 dark:focus:ring-indigio-500 focus:ring-offset-2`}
                        />
                        <svg
                          className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1/2  top-[.65rem] -translate-x-1/2 -translate-y-1/2"
                          xmlns="http://w3.org"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`text-[0.9rem]  ${i.checked ? 'text-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-slate-300'}`}
                    >
                      {i.name}
                    </div>
                  </div>
                  <div className="flex gap-2  justify-end">
                    <div className="relative flex">
                      <input
                        type="checkbox"
                        onChange={() => {
                          handleXCheck(i.id, id);
                        }}
                        disabled={
                          !options.some((x) => x.id === i.id && x.checked)
                        }
                        checked={i.xChecked}
                        className={`peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700 dark:checked:bg-slate-700 dark:checked:border-indigio-300 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-indigo-400 dark:focus:ring-indigio-500 focus:ring-offset-2`}
                      />
                      <svg
                        className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1/2  top-[.65rem] -translate-x-1/2 -translate-y-1/2"
                        xmlns="http://w3.org"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <div
                        className={`text-[0.9rem] italic ${i.xChecked ? 'text-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-slate-300'}`}
                      >
                        Exclusive
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CheckBoxListReproSearchParam;
