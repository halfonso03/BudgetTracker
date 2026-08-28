import Button from '../../components/Button';
import { useState } from 'react';
import Modal2 from '../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  reproId: number;
};

const ReproMiniDetailsModal = ({ reproId, ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  return (
    <Modal2
      size="lg"
      title="Reprogramming Details"
      animateOut={animateOut}
      {...props}
    >
      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">{reproId}</div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
            setAnimateOut(true);
            setTimeout(() => {
              setAnimateOut(false);
            }, 500);
          }}
        >
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default ReproMiniDetailsModal;
