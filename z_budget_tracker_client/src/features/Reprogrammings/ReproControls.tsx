import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { useHasUnsavedChangesStore } from '../../state/useHasUnsavedChangesStore';
import ChooseYearModal from './modals/ChooseYearModal';

// const NEW_REPRO
// type Actions:number
type Props = {
  reproId: number | undefined;
  onYearSelected: (year: number, justification: string) => void;
  onSearchClick: () => void;
  onDuplicateReprogramming: () => void;
};

const ReproControls = ({
  onYearSelected,
  onSearchClick,
  onDuplicateReprogramming,
  reproId,
}: Props) => {
  console.log('ReproControls render');

  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  const [confirmLooseChangesModalIsOpen, setConfirmLooseChangesModalIsOpen] =
    useState(false);
  const [confirmDuplicateModalIsOpen, setConfirmDuplicateModalIsOpen] =
    useState(false);
  const hasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.hasUnsavedChanges,
  );

  const [duplicating, setDuplicating] = useState(false);

  const handleYearSelected = (e: { year: number; justification: string }) => {
    onYearSelected(e.year, e.justification);

    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleSearchClick() {
    onSearchClick();
  }

  function handleDuplicateClick() {
    if (hasUnsavedChanges) {
      setDuplicating(true);
      setConfirmLooseChangesModalIsOpen(true);
    } else {
      setConfirmDuplicateModalIsOpen(true);
    }
  }

  

  return (
    <>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => {
            if (hasUnsavedChanges) {
              setConfirmLooseChangesModalIsOpen(true);
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
        {reproId && (
          <Button
            buttonSize="small"
            variation="secondary"
            onClick={handleDuplicateClick}
          >
            Duplicate
          </Button>
        )}
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
        isOpen={confirmLooseChangesModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmLooseChangesModalIsOpen(false);
          }, 500);
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmLooseChangesModalIsOpen(false);
          }, 500);
          setTimeout(() => {
            if (duplicating) {
              onDuplicateReprogramming();
            } else {
              setChoosingYear(true);
            }
          }, 500);
        }}
        message="Are you sure you wish to leave this page? Any changes made to this entry will be lost. Click OK to continue."
      ></ConfirmModal>
      <ConfirmModal
        isOpen={confirmDuplicateModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmDuplicateModalIsOpen(false);
            setDuplicating(false)
          }, 500);
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmDuplicateModalIsOpen(false);
          }, 500);
          onDuplicateReprogramming();
        }}
        message="Duplicate the current reprogramming? Click OK to continue."
      ></ConfirmModal>
    </>
  );
};
export default ReproControls;
