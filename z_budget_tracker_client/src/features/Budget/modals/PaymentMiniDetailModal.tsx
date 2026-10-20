import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  paymentId: number;
  initiativeId: number;
  grantId: number;
  accountName: string;
};

const PaymentMiniDetailsModal = ({ paymentId, ...props }: Props) => {
  // if (!isSuccess) return <div>Loading...</div>;

  return (
    <Modal2 size="xl" title="Payment Details" animateOut={false} {...props}>
      payment info {paymentId}
    </Modal2>
  );
};
export default PaymentMiniDetailsModal;
