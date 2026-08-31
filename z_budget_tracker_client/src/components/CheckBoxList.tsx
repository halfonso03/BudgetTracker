type Props = {
  label: string;
  items: { id: number; name: string }[];
  key: string;
  onCheck: (id: number, key: string) => void;
};

const CheckBoxList = ({ label, items, onCheck, key }: Props) => {
  return (
    <div className="">
      <div className="font-semibold text-lg text-neutral-500 ml-1">{label}</div>
      <div>
        <ul>
          {items?.map((i, index) => (
            <li key={index} className="flex gap-2 p-1 text-neutral-700">
              <div>
                <div className="relative flex items-start pt-1 pb-1">
                  <input
                    type="checkbox"
                    onChange={() => onCheck(i.id, key)}
                    className={`peer appearance-none w-6 h-6 border-2 border-gray-300 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700  dark:checked:bg-green-700 dark:checked:border-green-700 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-green-500 focus:ring-offset-2`}
                  />
                  <svg
                    className="absolute w-4.5 h-4.5 text-white pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
              <div className="text-lg">{i.name}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CheckBoxList;
