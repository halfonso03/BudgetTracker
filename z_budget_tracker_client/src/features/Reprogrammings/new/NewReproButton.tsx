import { useState } from 'react';
import Button from '../../../components/Button';
import ChooseYearModal from '../ChooseYearModal';
import { Search } from 'lucide-react';

type Props = {
  onYearSelected: (year: number, justification: string) => void;
  raiseConfirmOnSearch: boolean;
  onSearchClick: () => void;
};
const NewReproButton = ({
  onYearSelected,
  onSearchClick,
  raiseConfirmOnSearch,
}: Props) => {
  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');

  const handleYearSelected = (e: { year: number; justification: string }) => {
    onYearSelected(e.year, e.justification);

    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleSearchClick() {
    if (raiseConfirmOnSearch) {
      confirm('are you sure?');
    }
    // onSearchClick();
  }

  return (
    <>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => {
            setChoosingYear(true);
            setNewReproJustification('');
          }}
        >
          Start New...
        </Button>
        <Button
          buttonSize="xsmall"
          variation="secondary"
          onClick={handleSearchClick}
        >
          <Search></Search>
        </Button>
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        newReproJustification={newReproJustification}
        onYearSelected={handleYearSelected}
        onCancel={() => {
          setTimeout(() => {
            setChoosingYear(false);
          }, 500);
        }}
      ></ChooseYearModal>
    </>
  );
};
export default NewReproButton;
