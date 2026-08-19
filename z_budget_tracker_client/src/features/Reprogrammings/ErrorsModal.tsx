import Button from '../../components/Button';
import { useState } from 'react';
import Modal2 from '../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  errors: string[];
};

const ErrorsModal = ({ ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  return (
    <Modal2
      size="lg"
      title={
        props.errors.length + ' Error' + (props.errors.length > 0 ? 's' : '')
      }
      animateOut={animateOut}
      {...props}
    >
      <div className="flex flex-col gap-4 mx-4 mb-8 mt-8">
        {props.errors.map((m) => (
          <div key={m}>{m}.</div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="secondary"
          type="button"
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
export default ErrorsModal;
