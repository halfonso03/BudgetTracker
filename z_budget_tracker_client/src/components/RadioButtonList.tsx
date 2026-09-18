type Props = {
  id: string;
  items: { id: number; name: string; checked: boolean }[];
  onSelected: (id: number) => void;
};

const RadioButtonList = ({ items, onSelected,id }: Props) => {

    console.log('items', items)
  return (
    <div className="p-2 mt-4 pl-4">
      {items.map((item, index) => (
        <div key={index} className="my-3 mt-0 flex ">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              className={`sr-only peer`}
              id="password-options"
              name={`radiooptions-${id}`}
              value={item.id}
              onClick={() => {
                onSelected(item.id);
              }}
              checked={item.checked}
            />
            <div
              className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                peer-checked:border-blue-700 peer-checked:bg-blue-700 dark:peer-checked:border-green-700 dark:peer-checked:bg-green-700  
                group-hover:border-gray-400 transition-all duration-200`}
            >
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div>{item.name}</div>
          </label>
        </div>
      ))}
    </div>
  );
};
export default RadioButtonList;
