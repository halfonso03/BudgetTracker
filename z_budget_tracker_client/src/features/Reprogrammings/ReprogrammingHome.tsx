import { Search } from 'lucide-react';
import useCategories from '../../api/hooks/useCategories';
import useInitiatives from '../../api/hooks/useInitiatives';
import Button from '../../components/Button';
import { useState } from 'react';
import ChooseYearModal from './ChooseYearModal';

const ReprogrammingHome = () => {
  const [editing, setEditing] = useState(false);
  const [choosingYear, setChoosingYear] = useState(false);
  const { data: initiatives } = useInitiatives();
  const { data: categories } = useCategories();
  const [year, setYear] = useState<number>(0);
  const [animateOut, setAnimateOut] = useState<boolean>(false);

  const [repro, setRepro] = useState<Repro | null>(null);

  return (
    <>
      <div className="flex  justify-between">
        <div>
          {/* <Button buttonSize='small' disabled={!editing}>
            <Plus></Plus>
            Add Line
          </Button> */}
        </div>
        <div className="flex gap-3">
          <Button
            variation="primary"
            onClick={() => setChoosingYear(true)}
            disabled={editing}
          >
            Start New...
          </Button>
          <button className="bg-neutral-300 p-3 rounded-sm" onClick={() => {}}>
            <Search></Search>
          </button>
        </div>
      </div>
      <div></div>
      <div>
        {repro &&
          repro.items &&
          repro.items.map((item: ReproLineItem) => {
            return <div>{item.accountName}</div>;
          })}
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        animateOut={animateOut}
        onYearSelected={(year: number) => {
          setAnimateOut(true);
          setYear(year);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOut(false);
          }, 500);
        }}
        onCancelForm={() => {
          setAnimateOut(true);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOut(false);
          }, 500);
        }}
      ></ChooseYearModal>
    </>
  );
};
export default ReprogrammingHome;
