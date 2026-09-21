import useTransactions from '../../../api/hooks/budgets/useTransactions';
import { formatCurrency, formatDate, formatNumber } from '../../../app/util';
import Modal2 from '../../../components/Modal2';
import { Fragment, useState } from 'react';
import Button from '../../../components/Button';

type Props = {
  initiativeId: number;
  grantId: number;
  accountId: number;
  accountName: string;
  isOpen: boolean;
  onCancel: () => void;
  onSelectedId: (id: number, accountName: string, initiativeId: number) => void;
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

  const handleCancel = () => {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  };
  return (
    <Fragment>
      <Modal2
        size="md"
        title="Transactions"
        animateOut={animateOut}
        {...props}
        onCancel={handleCancel}
      >
        <div className="">
          <div className="font-semibold text-neutral-700">Account</div>
          <div className="font-semibold self-end mb-3">{props.accountName}</div>
          <div className="grid grid-cols-[1.6fr_1.5fr_1fr_1fr] gap-2 my-3 border-b border-b-neutral-200">
            <div></div>
            <div className="text-center font-semibold text-neutral-600">
              Posted Date
            </div>
            <div className="text-center font-semibold text-neutral-600">
              Amount
            </div>
            <div className="text-end font-semibold text-neutral-600">
              Balance
            </div>
          </div>
          {data?.map((t, i) => {
            if (i > 0) remaining += data[i].amount;
            return (
              <div
                className="grid grid-cols-[1.6fr_1.5fr_1fr_1fr] gap-2 my-3"
                key={i}
              >
                <div className="flex gap-2">
                  <div>{t.typeName}</div>
                  <div>
                    {t.typeName == 'Reprogramming' ? (
                      <button
                        className="cursor-pointer underline underline-offset-3 text-blue-600"
                        onClick={() => {
                          props.onSelectedId(
                            t.id,
                            props.accountName,
                            props.initiativeId,
                          );
                        }}
                      >
                        {t.id}
                      </button>
                    ) : null}
                    {t.typeName == 'Disbursement' ? (
                      <button
                        className="cursor-pointer underline underline-offset-3 text-blue-600"
                        onClick={() => {
                          props.onSelectedId(
                            t.id,
                            props.accountName,
                            props.initiativeId,
                          );
                        }}
                      >
                        {t.id}
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="text-center">{formatDate(t.postedDate)}</div>
                <div className="text-center">{formatCurrency(t.amount)}</div>
                <div className={`text-end`}>{formatNumber(remaining)}</div>
              </div>
            );
          })}
          <div className="flex justify-end mt-8">
            <Button variation="secondary" onClick={handleCancel}>
              Close
            </Button>
          </div>
        </div>
      </Modal2>
    </Fragment>
  );
};
export default TransactionsModal;
