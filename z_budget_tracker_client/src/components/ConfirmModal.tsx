import Modal from './Modal';
import Button from './Button';

type Props = {
  isOpen: boolean;
  animateOut: boolean;
  onCancel: () => void;
  message: string;
  onConfirm: () => void
};

const ConfirmModal = ({ ...props }: Props) => {
  return (
    <Modal size="sm" {...props} title="Confirm Action">
      <div>
        <div className="my-10">{props.message}</div>
        <div className="flex justify-end gap-3">
          <Button buttonSize="small" onClick={props.onConfirm}>
            Ok
          </Button>
          <Button
            buttonSize="small"
            variation="secondary"
            onClick={() => {
              props.onCancel();
              setTimeout(() => {}, 500);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmModal;
