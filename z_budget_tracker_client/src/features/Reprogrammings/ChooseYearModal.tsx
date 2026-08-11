import { useState, type ChangeEvent } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

type Props = {
  isOpen: boolean;
  animateOut: boolean;
  onYearSelected: (year: number) => void;
  onCancelForm: () => void;
};

const ChooseYearModal = ({
  onYearSelected,
  onCancelForm,
  isOpen,
  animateOut,
}: Props) => {
  const [year, setYear] = useState<number>(0);
  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    if (+e.target.value !== 0) {
      setYear(+e.target.value);
    }
  }

  return (
    <Modal
      size="sm"
      title="New Reprogamming"
      isOpen={isOpen}
      animateOut={animateOut}
      onClose={onCancelForm}
    >
      <div className="p-3 px-4">
        <div className="mb-3">
          <div className="entity-label">YEAR</div>
          <select
            value={year}
            className="p-2 border border-neutral-300 disabled:opacity-60"
            onChange={handleYearChange}
          >
            <option value="0" className="text-neutral-600">
              Select
            </option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            disabled={year === 0}
            onClick={() => {
              onYearSelected(year);
            }}
          >
            OK
          </Button>
          <Button
            variation="secondary"
            onClick={() => {
              onCancelForm();
              setTimeout(() => setYear(0), 500);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ChooseYearModal;
