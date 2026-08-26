import { useState } from 'react';
import Button from '../../../components/Button';
import ChooseYearModal from '../ChooseYearModal';

type Props = {
  onYearSelected: (year: number, justification: string) => void;
};
const NewReproButton = ({ onYearSelected }: Props) => {
  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');

  const handleYearSelected = (e: { year: number; justification: string }) => {
    onYearSelected(e.year, e.justification);

    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

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
