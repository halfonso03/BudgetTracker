import { useSortingContext } from "../../contexts/useSortingContext";

type Props = {
  results: PaymentSearchResult[];
  // onDelete: (id: number) => void;
};

const PaymentSearchReults = ({ results }: Props) => {
  const { sortByValue } = useSortingContext();
  if (results.length == 0) return null;

  return <div>PaymentSearchReults</div>;
};
export default PaymentSearchReults;
