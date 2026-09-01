import { useState, type ChangeEvent } from 'react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import Select from '../../components/Select';
import useGrants from '../../api/hooks/common/useGrants';
import CheckBoxList from '../../components/CheckBoxList';
import useCategories from '../../api/hooks/common/useCategories';

type SelectedItem = {
  id: number;
  type: string;
};

const INITIATIVES_LIST_TYPE = 'I';
const GRANTS_LIST_TYPE = 'G';
const ACCOUNTS_LIST_TYPE = 'A';

const Search = () => {
  const [year, setYear] = useState(2026);
  const [status, setStatus] = useState<number>(0);

  const { initiatives, loadingInit } = useInitiatives();
  const { grants, loadingGrants } = useGrants(+year);
  const { categories, loadingCat } = useCategories(true, true);

  const itemsList =
    grants?.length && categories?.length && initiatives?.length
      ? [
          ...initiatives.map((i) => ({
            id: i.id,
            type: INITIATIVES_LIST_TYPE,
          })),
          ...grants.map((g) => ({ id: g.id, type: GRANTS_LIST_TYPE })),
          ...categories.map((c) => ({ id: c.id, type: ACCOUNTS_LIST_TYPE })),
        ]
      : [];

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(itemsList);

  if (loadingInit || loadingCat || loadingGrants) return <div>Loading...</div>;

  function handleCheck(id: number, type: string) {
    setSelectedItems(
      selectedItems.some((x) => x.id === id && x.type === type)
        ? [
            ...selectedItems.filter(
              (x) => (x.type === type && x.id !== id) || x.type !== type,
            ),
          ]
        : [...selectedItems, { id: id, type: type }],
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(selectedItems)}</pre>

      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 border border-b-0 border-neutral-200 p-2 rounded-t-md">
            <div className="font-semibold text-neutral-600  self-center">
              Year:
            </div>
            <Select
              value={year}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setYear(+e.target.value)
              }
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </Select>
          </div>
          <div className="border border-b-0 border-neutral-200 ">
            <CheckBoxList
              label="Initiative:"
              id={INITIATIVES_LIST_TYPE}
              onCheck={handleCheck}
              items={initiatives!.map((i) => ({ ...i, checked: true }))}
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200 ">
            <CheckBoxList
              label="Award:"
              id={GRANTS_LIST_TYPE}
              onCheck={handleCheck}
              items={grants!.map((i) => ({ ...i, checked: true }))!}
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200  ">
            <CheckBoxList
              label="Account:"
              id={ACCOUNTS_LIST_TYPE}
              maxHeight={160}
              onCheck={handleCheck}
              items={categories!.map((i) => ({ ...i, checked: true }))!}
            ></CheckBoxList>
          </div>
          <div className="border border-b-0 border-neutral-200 pl-2 py-2 flex gap-3 ">
            <div className="font-semibold text-neutral-600 ml-1 self-center">
              Status:
            </div>
            <div>
              <Select
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatus(+e.target.value)
                }
              >
                <option value="0">All</option>
                <option value="1">Saved</option>
                <option value="2">Posted</option>
              </Select>
            </div>
          </div>
          <div className="border border-b-0 border-neutral-200 p-2">
            <div className="font-semibold text-neutral-600 ml-1">Amount:</div>
          </div>
        </div>
        <div className="flex-4 p-2 ">results</div>
        {/* <Button
        onClick={() => {
          saveSearchParams({ year: 2026, initiativeIds: [1, 2, 3] });
        }}
      >
        Save Params
      </Button> */}
      </div>
    </div>
  );
};
export default Search;
