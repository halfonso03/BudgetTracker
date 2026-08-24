import { useState } from 'react';
import Button from './Button';
import Modal2 from './Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  message: string;
  onConfirm: () => void;
};

const ConfirmModal = ({ ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  return (
    <Modal2 size="sm" {...props} title="Confirm Action" animateOut={animateOut}>
      <div>
        <div className="my-8 mb-14">{props.message}</div>
        <div className="flex justify-end gap-3">
          <Button
            buttonSize="small"
            onClick={() => {
              props.onConfirm();
              setAnimateOut(true);
              setTimeout(() => {
                setAnimateOut(false);
              }, 600);
            }}
          >
            OK
          </Button>
          <Button
            buttonSize="small"
            variation="secondary"
            onClick={() => {
              props.onCancel();
              setAnimateOut(true);
              setTimeout(() => {
                setAnimateOut(false);
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
export default ConfirmModal;
