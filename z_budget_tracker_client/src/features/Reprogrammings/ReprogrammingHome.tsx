import { Plus, Search } from 'lucide-react';
import useCategories from '../../api/hooks/useCategories';
import useInitiatives from '../../api/hooks/useInitiatives';
import Button from '../../components/Button';
import { useState } from 'react';
import ChooseYearModal from './ChooseYearModal';
import useGrants from '../../api/hooks/useGrants';
import AddLineModal from './AddLineModal';

const ReprogrammingHome = () => {
  const [choosingYear, setChoosingYear] = useState(false);
  const [addingLine, setAddingLine] = useState(false);
  const { data: initiatives } = useInitiatives();
  const { data: categories } = useCategories();
  const [year, setYear] = useState<number>(0);

  const { data: grants } = useGrants(year);

  console.log('grants', grants);
  console.log('grants', initiatives);
  console.log('grants', categories);

  const [animateOutYearSelect, setAnimateOutYearSelect] =
    useState<boolean>(false);
  const [animateOutAddLine, setAnimateOutAddLine] = useState<boolean>(false);

  const [repro, setRepro] = useState<Repro | null>(null);

  return (
    <>
      <div className="">
        <div className="flex justify-end gap-3">
          <Button
            buttonSize="small"
            variation="primary"
            onClick={() => setChoosingYear(true)}
            disabled={year > 0}
          >
            Start New...
          </Button>
          <Button
            buttonSize="small"
            variation="secondary"
            disabled={year > 0}
            onClick={() => {}}
          >
            <Search></Search>
          </Button>
          <Button
            variation="danger"
            disabled={year === 0}
            onClick={() => {
              setYear(0);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="mb-6">
        {year > 0 && (
          <>
            <span className="text-neutral-500 font-bold mr-4">Year</span>
            <span className="font-bold">{year}</span>
          </>
        )}
      </div>
      <div>
        {year > 0 && (
          <Button buttonSize="small" onClick={() => setAddingLine(true)}>
            <Plus></Plus>
            Add Line
          </Button>
        )}
      </div>
      <div>
        {repro &&
          repro.items &&
          repro.items.map((item: ReproLineItem) => {
            return <div>{item.accountName}</div>;
          })}
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        animateOut={animateOutYearSelect}
        onYearSelected={(year: number) => {
          setAnimateOutYearSelect(true);
          setYear(year);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOutYearSelect(false);

            setRepro(null);
          }, 500);
        }}
        onCancel={() => {
          setAnimateOutYearSelect(true);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOutYearSelect(false);
          }, 500);
        }}
      ></ChooseYearModal>

      <AddLineModal
        isOpen={addingLine}
        animateOut={animateOutAddLine}
        initiatives={initiatives}
        grants={grants}
        categories={categories}
        onCancel={() => {
          setAnimateOutAddLine(true);
          setTimeout(() => {
            setAddingLine(false);
            setAnimateOutAddLine(false);
          }, 500);
        }}
      ></AddLineModal>
    </>
  );
};
export default ReprogrammingHome;
