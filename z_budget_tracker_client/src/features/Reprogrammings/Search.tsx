import { useState, type ChangeEvent } from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import Select from '../../components/Select';
import useGrants from '../../api/hooks/common/useGrants';

const Search = () => {
  const [year, setYear] = useState<string>('2026');
  const { data: initiatives, loadingInit } = useInitiatives();
  const { data: grants } = useGrants(+year);
  if (loadingInit) return <div>Loading...</div>;

  return (
    <div className="flex">
      <div className="flex flex-col flex-1  ">
        <div className="border  border-b-0 border-neutral-200 p-2 rounded-t-md">
          <div className="font-semibold text-lg text-neutral-500 ml-1">
            Year:
          </div>
          <Select
            value={year}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setYear(e.target.value)
            }
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>
        <div className="border  border-b-0 border-neutral-200 p-2">
          <div className="font-semibold text-lg text-neutral-500 ml-1">
            Initiative:
          </div>
          <div>
            <ul>
              {initiatives?.map((i, index) => (
                <li key={index} className="flex gap-2 p-1 text-neutral-700">
                  <div>
                    <div className="relative flex items-start pt-1 pb-1">
                      <input
                        type="checkbox"
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
        <div className="border border-b-0 border-neutral-200 p-2">
          <div className="font-semibold text-lg text-neutral-500 ml-1">
            Award:
          </div>
          <div>
            <ul>
              {grants?.map((i, index) => (
                <li key={index} className="flex gap-2 p-1 text-neutral-700">
                  <div>
                    <div className="relative flex items-start pt-1 pb-1">
                      <input
                        type="checkbox"
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
        <div className="border border-b rounded-b-md border-neutral-200 p-2">
          <div className="font-semibold text-lg text-neutral-500 ml-1">
            Amount:
          </div>
        </div>
      </div>
      <div className="flex-3 p-2 ">results</div>
      {/* <Button
        onClick={() => {
          saveSearchParams({ year: 2026, initiativeIds: [1, 2, 3] });
        }}
      >
        Save Params
      </Button> */}
    </div>
  );
};
export default Search;
