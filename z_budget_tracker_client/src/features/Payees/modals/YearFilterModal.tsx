import { useState, type ChangeEvent } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import Select from '../../../components/Select';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onYearSelected: (year: number) => void;
};

const YearFilterModal = ({ ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const [year, setYear] = useState(0);

  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }

  return (
    <Modal2
      size="sm"
      title="Filter Total Paid"
      animateOut={animateOut}
      {...props}
    >
      <div>
        <div>
          <div className="font-semibold text-neutral-600 mb-3">
            Filter Total Paid by Year:
          </div>
          <div className="w-[35%]">
            <Select
              value={year}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setYear(+e.target.value);
              }}
            >
              <option value="0">No Filter</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="primary"
          onClick={() => {
            props.onYearSelected(year);
            closeModal();
          }}
        >
          Apply Filter
        </Button>
      </div>
    </Modal2>
  );
};
export default YearFilterModal;
