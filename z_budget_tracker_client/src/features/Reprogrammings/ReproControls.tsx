import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { useHasUnsavedChangesStore } from '../../state/useHasUnsavedChangesStore';
import ChooseYearModal from '../Common/modals/ChooseYearModal';
import { NavLink} from 'react-router-dom';

type Props = {
  reproId?: number | undefined;
  onYearSelected: (year: number, justification: string) => void;
  onSearchClick: () => void;
  onDuplicateReprogramming?: () => void;
};

const ReproControls = ({
  onYearSelected,
  onSearchClick,
  reproId = 0,
}: Props) => {
  // console.log('ReproControls render');
  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  const [confirmLooseChangesModalIsOpen, setConfirmLooseChangesModalIsOpen] =
    useState(false);

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
      <div className="flex justify-start gap-3 mt-6">
        <Button
          buttonSize="large"
          additionalclasses="py-2"
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
          New Reprogramming...
        </Button>
        <Button
          buttonSize="xsmall"
          variation="secondary"
          onClick={handleSearchClick}
        >
          <Search></Search>
        </Button>
        {reproId !== undefined && reproId !== 0 && (
          <NavLink
            to={`/reprogramming/duplicate/${reproId}`}
            className="font-semibold text-neutral-50 bg-neutral-500/70  hover:bg-neutral-500 hover:border-gray-400 disabled:opacity-70 disabled:text-neutral-500 dark:bg-transparent dark:text-white dark:border-gray-600 dark:hover:bg-neutral-800 dark:hover:border-gray-600 transition-all duration-300 p-2 w-35 cursor-pointer disabled:cursor-not-allowed rounded-sm shadow-sm flex justify-center items-center "
          >
            Duplicate
          </NavLink>
        )}
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        title="New Reprogramming"
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
          setHasUnsavedChanges(false);
          setTimeout(() => {
            setConfirmLooseChangesModalIsOpen(false);
          }, 500);
          setTimeout(() => {
            setChoosingYear(true);
          }, 500);
        }}
        message="Are you sure you wish to leave this page? Any changes made to this entry will be lost. Click OK to continue."
      ></ConfirmModal>
      {/* <ConfirmModal
        isOpen={confirmDuplicateModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmDuplicateModalIsOpen(false);
            // setDuplicating(false);
          }, 500);
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmDuplicateModalIsOpen(false);
            navigate(`/reprogramming/duplicate/${reproId}`);
          }, 500);
          // onDuplicateReprogramming?.();
        }}
        message="Duplicate the current reprogramming? Click OK to continue."
      ></ConfirmModal> */}
    </>
  );
};
export default ReproControls;
