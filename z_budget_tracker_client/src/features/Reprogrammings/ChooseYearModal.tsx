import { useState, type ChangeEvent } from 'react';
import Button from '../../components/Button';
import Modal2 from '../../components/Modal2';

type Props = {
  isOpen: boolean;
  newReproJustification: string;
  onYearSelected: (e: { year: number; justification: string }) => void;
  onCancel: () => void;
};

const ChooseYearModal = ({ ...props }: Props) => {
  const [year, setYear] = useState<number>(0);
  const [justification, setJustification] = useState(
    props.newReproJustification,
  );
  const [animateOut, setAnimateOut] = useState(false);

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    if (+e.target.value !== 0) {
      setYear(+e.target.value);
    }
  }

  return (
    <Modal2
      size="sm"
      title="New Reprogamming"
      animateOut={animateOut}
      {...props}
    >
      <div>
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
            value={justification}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setJustification(e.target.value)
            }
          ></textarea>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            disabled={year === 0}
            onClick={() => {
              props.onYearSelected({ year, justification });
              setJustification('');
              setAnimateOut(true);
              setTimeout(() => {
                setAnimateOut(false);
                setYear(0);
              }, 500);
            }}
          >
            Continue...
          </Button>
          <Button
            variation="secondary"
            onClick={() => {
              props.onCancel();
              setAnimateOut(true);
              setTimeout(() => {
                setAnimateOut(false);
                setJustification('');
                setYear(0);
              }, 500);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal2>
  );
};
export default ChooseYearModal;
