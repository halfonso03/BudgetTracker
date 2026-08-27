import { Fragment } from 'react/jsx-runtime';
import useTransactions from '../../api/hooks/budgets/useTransactions';
import { formatDate, formatNumber } from '../../app/util';
import Modal2 from '../../components/Modal2';
import { useState } from 'react';
import Button from '../../components/Button';

type Props = {
  initiativeId: number;
  grantId: number;
  accountId: number;
  isOpen: boolean;
  onCancel: () => void;
};

const TransactionsModal = (props: Props) => {
  const { data, isLoading } = useTransactions(
    props.initiativeId,
    props.grantId,
    props.accountId,
  );
  const [animateOut, setAnimateOut] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Loading...</div>;
  if (!data.length) return null;

  let remaining = data[0].amount;
  return (
    <Modal2 size="md" title="Transactions" animateOut={animateOut} {...props}>
      <div className="p-2 ">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 my-3 border-b border-b-neutral-200">
          <div></div>
          <div className="text-center font-semibold text-neutral-600">
            Post Date
          </div>
          <div className="text-end font-semibold text-neutral-600">Amount</div>
          <div className="text-end font-semibold text-neutral-600">
            Remaining Balance
          </div>
        </div>
        {data?.map((t, i) => {
          if (i > 0) remaining += data[i].amount;
          return (
            <div
              className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 my-3"
              key={i}
            >
              <div>{t.typeName}</div>
              <div className="text-center">{formatDate(t.postedDate)}</div>
              <div className="text-end">{formatNumber(t.amount)}</div>
              <div className={`text-end`}>{formatNumber(remaining)}</div>
            </div>
          );
        })}
        <div className="flex justify-end mt-8">
          <Button
            variation="secondary"
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
      </div>
    </Modal2>
  );
};
export default TransactionsModal;
