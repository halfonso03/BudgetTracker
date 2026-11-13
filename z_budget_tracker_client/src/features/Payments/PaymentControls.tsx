import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ChooseYearModal from '../Common/modals/ChooseYearModal';
import { useHasUnsavedChangesStore } from '../../state/useHasUnsavedChangesStore';
import ConfirmModal from '../../components/ConfirmModal';
import { NavLink, useNavigate } from 'react-router-dom';

// const NEW_REPRO
// type Actions:number
type Props = {
  paymentId?: number | undefined;
  onYearSelected: (year: number, justification: string) => void;
  onSearchClick: () => void;
  onDuplicatePayment?: () => void;
};

const PaymentControls = ({
  onYearSelected,
  onSearchClick,
  paymentId = 0,
}: Props) => {
  // console.log('ReproControls render');
  const navigate = useNavigate();

  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  const [confirmLooseChangesModalIsOpen, setConfirmLooseChangesModalIsOpen] =
    useState(false);
  // const [confirmDuplicateModalIsOpen, setConfirmDuplicateModalIsOpen] =
  //   useState(false);
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

  // function handleDuplicateClick() {
  //   if (hasUnsavedChanges) {
  //     setDuplicating(true);
  //     setConfirmLooseChangesModalIsOpen(true);
  //   } else {
  //     setConfirmDuplicateModalIsOpen(true);
  //   }
  // }

  return (
    <>
      <div className="flex justify-start gap-3 mt-6">
        <Button
          buttonSize="large"
          variation="primary"
          additionalclasses="py-[.5rem]"
          onClick={() => {
            if (hasUnsavedChanges) {
              setConfirmLooseChangesModalIsOpen(true);
            } else {
              setChoosingYear(true);
              setNewReproJustification('');
            }
          }}
        >
          New Payment...
        </Button>
        <Button
          buttonSize="xsmall"
          variation="secondary"
          onClick={handleSearchClick}
        >
          <Search></Search>
        </Button>
        {paymentId !== undefined && paymentId !== 0 && (
          <Button
            variation="secondary"
            onClick={() => {
              navigate(`/payments/duplicate/${paymentId}`);
            }}
          >
            Duplicate
          </Button>
        )}
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        title="New Payment"
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
            setDuplicating(false);
          }, 500);
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmDuplicateModalIsOpen(false);
          }, 500);
          onDuplicatePayment?.();
        }}
        message="Duplicate the current payment? Click OK to continue."
      ></ConfirmModal> */}
    </>
  );
};
export default PaymentControls;
