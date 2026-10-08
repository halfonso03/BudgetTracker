import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import { PaginationContextProvider } from '../../../contexts/pagination/PaginationContextProvider';
import PayeePaymentsList from '../../Payees/PayeePaymentsList';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  payeeId: number | null | undefined;
};

const InfoModal = ({ ...props }: Props) => {
  return (
   
      <Modal2 size="xl" title="Payee Information" animateOut={false} {...props}>
        <div className=" mb-4 gap-4">
          {props.payeeId && (
            <PayeePaymentsList payeeId={props.payeeId}></PayeePaymentsList>
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
      </Modal2>
  );
};
export default InfoModal;
