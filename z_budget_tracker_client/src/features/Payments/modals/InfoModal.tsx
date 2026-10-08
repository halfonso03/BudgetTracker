import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
};

const InfoModal = ({ ...props }: Props) => {
  return (
    <Modal2 size="xl" title="Payee Information" animateOut={false} {...props}>
      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">sdsd</div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
          }}
        >
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default InfoModal;
