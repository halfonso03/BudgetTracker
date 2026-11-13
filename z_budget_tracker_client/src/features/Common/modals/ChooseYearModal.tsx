import { useState, type ChangeEvent } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import TextArea from '../../../components/TextArea';
import Select from '../../../components/Select';
import Label from '../../../components/Label';

type Props = {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  newReproJustification: string;
  onYearSelected: (e: { year: number; justification: string }) => void;
};

const ChooseYearModal = ({ ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);
  const [year, setYear] = useState<number>(0);
  const [justification, setJustification] = useState(
    props.newReproJustification,
  );

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    if (+e.target.value !== 0) {
      setYear(+e.target.value);
    }
  }

  return (
    <Modal2 size="lg" animateOut={animateOut} {...props}>
      <div>
        <div className="mb-3">
          <div className="mb-1">
            <Label>Year</Label>
          </div>
          <Select value={year} onChange={handleYearChange}>
            <option value="0" className="text-neutral-600 dark:text-slate-100">
              Select
            </option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>
        <div className="mb-4">
          <Label>Enter a Justification</Label>
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
