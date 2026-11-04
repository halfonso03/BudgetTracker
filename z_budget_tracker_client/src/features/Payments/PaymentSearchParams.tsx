type Props = {
  years: { id: number; name: string }[];
  onYearChange: (year: number) => void;
  onStatusChange: (id: number) => void;
};
const PaymentSearchParams = ({ onYearChange, onAmountFilter }: Props) => {
  return <div>PaymentSearchParams</div>;
};
export default PaymentSearchParams;
