import { useState } from 'react';
import Button from '../../../components/Button';
import ChooseYearModal from '../ChooseYearModal';
import { Search } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import { useHasUnsavedChangesStore } from '../../../state/useHasUnsavedChangesStore';

type Props = {
  onYearSelected: (year: number, justification: string) => void;
  onSearchClick: () => void;
};
const NewReproButton = ({ onYearSelected, onSearchClick }: Props) => {
  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const hasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.hasUnsavedChanges,
  );

  const setHasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.setHasUnsavedChanges,
  );

  const handleYearSelected = (e: { year: number; justification: string }) => {
    onYearSelected(e.year, e.justification);

    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleSearchClick() {
    onSearchClick();
  }

  return (
    <>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => {
            if (hasUnsavedChanges) {
              setConfirmModalIsOpen(true);
            } else {
              setChoosingYear(true);
              setNewReproJustification('');
            }
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
      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
          setTimeout(() => {
            setChoosingYear(true);
          }, 500);
        }}
        message="Are you sure you wish to leave this page? Any changes made to this reprogramming will be lost. Click OK to continue."
      ></ConfirmModal>
    </>
  );
};
export default NewReproButton;
