import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import PayeePaymentsList from '../../Payees/PayeePaymentsList';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  payee: Payee | null | undefined;
};

const InfoModal = ({ ...props }: Props) => {
  return (
    <Modal2 size="xl" title="Payee Information" animateOut={false} {...props}>
      <div className="">
        <div className="flex my-2 mb-6 gap-3 ">
          <div className="text-neutral-700 font-semibold">Payee Name:</div>
          <div className=" font-semibold">{props.payee?.name}</div>
        </div>
        <div className=" mb-4 gap-4">
          {props.payee?.id && (
            <PayeePaymentsList
              payeeId={props.payee.id}
              showSkeleton={false}
            ></PayeePaymentsList>
          )}
        </div>
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
      </div>
    </Modal2>
  );
};
export default InfoModal;
