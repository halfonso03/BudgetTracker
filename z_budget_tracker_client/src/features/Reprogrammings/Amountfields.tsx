import { useState } from 'react';

interface AmountfieldsData {
  count: number;
  increment: () => void;
}

interface Props {
  render: (data: AmountfieldsData) => React.ReactNode;
}

const Amountfields = ({ render }: Props) => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((prev) => prev + 1);

  return <div>{render({ count, increment })}</div>;
};
export default Amountfields;
