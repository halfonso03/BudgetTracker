type Props = {
  label?: string;
  onCheck: () => void;
  checked: boolean;
};

const CheckBox = ({ checked, label, onCheck }: Props) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex items-start">
        <input
          type="checkbox"
          onChange={() => {
            onCheck();
          }}
          checked={checked}
          className={`peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-blue-700 checked:border-blue-700 dark:checked:bg-green-700 dark:checked:border-green-700 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-50 dark:focus:ring-green-500 focus:ring-offset-2`}
        />
        <svg
          className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
      <div className="text-[0.9rem]">{label}</div>
    </div>
  );
};
export default CheckBox;
