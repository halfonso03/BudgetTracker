import { useState, type ChangeEvent } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

type Props = {
  isOpen: boolean;
  animateOut: boolean;
  onYearSelected: (year: number) => void;
  onCancel: () => void;
};

const ChooseYearModal = ({ ...props }: Props) => {
  const [year, setYear] = useState<number>(0);
  const [reason, setReason] = useState('');

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    if (+e.target.value !== 0) {
      setYear(+e.target.value);
    }
  }

  return (
    <Modal size="sm" title="New Reprogamming" {...props}>
      <div >
        <div className="mb-3">
          <div className="entity-label mb-1">Year</div>
          <select
            value={year}
            className="p-2 border border-neutral-300 rounded-sm disabled:opacity-60 mb-4"
            onChange={handleYearChange}
          >
            <option value="0" className="text-neutral-600">
              Select
            </option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="entity-label">
          Reason
          <textarea
            className="font-normal text-neutral-950 w-full border border-neutral-300 rounded-sm p-2 outline-none focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all duration-300 ease-in-out"
            value={reason}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setReason(e.target.value)
            }
          ></textarea>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            disabled={year === 0}
            onClick={() => {
              props.onYearSelected(year);
            }}
          >
            Continue...
          </Button>
          <Button
            variation="secondary"
            onClick={() => {
              props.onCancel();
              setTimeout(() => {
                setReason('');
                setYear(0);
              }, 500);
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
