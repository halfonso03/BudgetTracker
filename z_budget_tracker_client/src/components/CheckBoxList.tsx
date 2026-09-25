import { useState } from 'react';
import CheckBox from './CheckBox';

type Props = {
  label?: string;
  items: { id: number; name: string; checked: boolean }[];
  controlId: string;
  tailWindBorderStyles?: string;
  onItemChecked?: (id: number, key: string) => void;
  onAllItemsChecked?: (key: string, items: number[]) => void;
  maxHeight?: number | null | undefined;
  onItemsCheckedSnapshot: (key: string, checkedItems: { id: number }[]) => void;
};

const CheckBoxList = ({
  label,
  items,
  controlId,
  tailWindBorderStyles,
  maxHeight,
  onItemChecked,
  onItemsCheckedSnapshot,
  onAllItemsChecked,
}: Props) => {
  const [options, setOptions] = useState<
    { id: number; name: string; checked: boolean }[]
  >(items.map((i) => ({ id: i.id, name: i.name, checked: i.checked })));

  const overFlowYAutoClass = maxHeight ? ` overflow-y-auto ` : ' ';
  const updatedMaxHeight = maxHeight ? maxHeight + 10 + 'px' : '';
  const [checkAll, setCheckAll] = useState(!items.some((x) => !x.checked));

  function handleCheck(id: number, key: string) {
    const newOptions = options.map((i) => ({
      ...i,
      checked: i.id === id ? !i.checked : i.checked,
    }));

    if (newOptions.filter((x) => x.checked).length !== options.length)
      setCheckAll(false);

    if (newOptions.filter((x) => x.checked).length == options.length)
      setCheckAll(true);

    setOptions(newOptions);
    onItemChecked?.(id, key);
    onItemsCheckedSnapshot(
      key,
      newOptions.filter((x) => x.checked),
    );
  }

  function onCheckboxChecked(itemId: string) {
    handleCheck(+itemId, controlId);
  }

  function onCheckBoxAllChecked(key: string) {
    onAllItemsChecked?.(
      key,
      options.map((x) => x.id),
    );
    setOptions((prev) => prev.map((p) => ({ ...p, checked: !checkAll })));
  }

  return (
    <div>
      <div className="font-semibold text-neutral-600">{label}</div>
      <div
        style={{
          maxHeight: updatedMaxHeight,
          padding: '4px',
        }}
      >
        <div className="flex gap-2 p-1 pl-2 py-2 text-neutral-700 border-l border-l-transparent ">
          <CheckBox
            checked={checkAll}
            label={'ALL'}
            onCheck={() => {
              setCheckAll(!checkAll);
              onCheckBoxAllChecked(controlId);
            }}
          ></CheckBox>
        </div>
        <div
          className={overFlowYAutoClass + (tailWindBorderStyles ?? '')}
          style={{
            maxHeight: updatedMaxHeight,
            padding: '1px',
          }}
        >
          <ul>
            {options?.map((i, index) => (
              <li key={index} className="flex gap-2 p-1 pl-2 text-neutral-700">
                <CheckBox
                  checked={i.checked}
                  label={i.name}
                  onCheck={() => {
                    onCheckboxChecked(i.id.toString());
                  }}
                ></CheckBox>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CheckBoxList;
// <div>
//         <div className="relative flex items-start">
//           <input
//             type="checkbox"
//             onChange={() => {

//               handleCheck(i.id, key);
//             }}
//             checked={i.checked}
//             className={`peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700 dark:checked:bg-green-700 dark:checked:border-green-700
//           transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-green-500 focus:ring-offset-2`}
//           />
//           <svg
//             className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
//             xmlns="http://w3.org"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <polyline points="20 6 9 17 4 12"></polyline>
//           </svg>
//         </div>
//       </div>
//       <div className="text-[0.9rem]">{i.name}</div>
