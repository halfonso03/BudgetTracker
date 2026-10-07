import { useState, type ChangeEvent } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import TextArea from '../../../components/TextArea';
import Select from '../../../components/Select';

type Props = {
  isOpen: boolean;
  newReproJustification: string;
  onYearSelected: (e: { year: number; justification: string }) => void;
  onCancel: () => void;
  title: string;
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
    <Modal2 size="lg" animateOut={animateOut} {...props}>
      <div>
        <div className="mb-3">
          <div className="entity-label mb-1">Year</div>
          <Select value={year} onChange={handleYearChange}>
            <option value="0" className="text-neutral-600">
              Select
            </option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>
        <div className="">
          <div className="entity-label">Enter a Justification</div>
          <TextArea
            value={justification}
            additionalclasses=""
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setJustification(e.target.value)
            }
          ></TextArea>
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
