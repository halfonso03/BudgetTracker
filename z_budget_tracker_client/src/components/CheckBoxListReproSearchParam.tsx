import { useState } from 'react';

type Props = {
  id: string;
  label: string;
  maxHeight?: number | null | undefined;
  items: { id: number; name: string; checked: boolean; xChecked: boolean }[];
  onCheck: (id: number, key: string) => void;
  onXCheck?: (id: number, key: string) => void;
  onDeselectAll: (type: string) => void;
  onSelectAll: (type: string) => void;

};

const CheckBoxListReproSearchParam = ({
  label,
  items,
  id,
  maxHeight,
  onCheck,
  onXCheck,
  onDeselectAll,
  onSelectAll
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
    setOptions((prev) => {
      return prev.map((i) => ({
        ...i,
        checked: i.id === id ? !i.checked : i.checked,
      }));
    });
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
      setOptions((prev) => [...prev.map((i) => ({ ...i, checked: false, xChecked: false }))]);
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
      {/* <pre>{JSON.stringify(options)}</pre> */}
      <div className=" flex justify-between font-semibold text-neutral-600 bg-neutral-100 p-2 ">
        <div className="pl-2">{label}</div>
        <div className="pr-2">
          <button
            className="text-blue-600 cursor-pointer"
            onClick={deselectAllClick}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      <div
        style={{
          maxHeight:
            maxHeight !== null && maxHeight !== undefined
              ? maxHeight + 10 + 'px'
              : '',
          padding: '4px',
        }}
      >
        <div
          className={overflowClass}
          style={{
            maxHeight:
              maxHeight !== null && maxHeight !== undefined
                ? maxHeight + 'px'
                : '',
            padding: '4px',
          }}
        >
          <ul>
            {options?.map((i, index) => (
              <li
                key={index}
                className="grid grid-cols-[2fr_1fr] p-1 text-neutral-700"
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
                        className={`peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700 dark:checked:bg-green-700 dark:checked:border-green-700 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-green-500 focus:ring-offset-2`}
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
                    className={`text-[0.9rem] italic ${i.checked ? 'text-neutral-700' : 'text-neutral-500'}`}
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
                      checked={i.xChecked}
                      className={`peer/excl appearance-none w-4.5 h-4.5 border-2 border-gray-300 rounded bg-transparent checked:bg-neutral-500 checked:border-neutral-500 dark:checked:bg-green-700 dark:checked:border-green-700 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-green-500 focus:ring-offset-2`}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked/excl:block left-1/2 top-[.6rem] -translate-x-1/2 -translate-y-1/2"
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
                      className={`text-[0.9rem] italic ${i.xChecked ? 'text-neutral-700' : 'text-neutral-400'}`}
                    >
                      Exclusive
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CheckBoxListReproSearchParam;
