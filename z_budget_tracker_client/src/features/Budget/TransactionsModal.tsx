import useTransactions from '../../api/hooks/budgets/useTransactions';
import { formatDate, formatNumber } from '../../app/util';
import Modal2 from '../../components/Modal2';
import { Fragment, useState } from 'react';
import Button from '../../components/Button';
import ReproMiniDetailsModal from '../Reprogrammings/ReproMiniDetailModal';

type Props = {
  initiativeId: number;
  grantId: number;
  accountId: number;
  category: string;
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

  const [miniDetailsIsOpen, setMiniDetailsIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
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
        <div className="p-2 ">
          <div className="font-semibold self-end mb-3">{props.category}</div>

          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-2 my-3 border-b border-b-neutral-200">
            <div></div>
            <div className="text-center font-semibold text-neutral-600">
              Post Date
            </div>
            <div className="text-end font-semibold text-neutral-600">
              Amount
            </div>
            <div className="text-end font-semibold text-neutral-600">
              Remaining Balance
            </div>
          </div>
          {data?.map((t, i) => {
            if (i > 0) remaining += data[i].amount;
            return (
              <div
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-2 my-3"
                key={i}
              >
                <div className="flex gap-2">
                  <div>{t.typeName}</div>
                  <div>
                    {t.typeName == 'Reprogramming' ? (
                      <button
                        className="cursor-pointer underline underline-offset-3 text-blue-600"
                        onClick={() => {
                          setMiniDetailsIsOpen(true);
                          setSelectedId(t.id);
                        }}
                      >
                        {t.id}
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="text-center">{formatDate(t.postedDate)}</div>
                <div className="text-end">{formatNumber(t.amount)}</div>
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
      <ReproMiniDetailsModal
        reproId={selectedId}
        isOpen={miniDetailsIsOpen}
        onCancel={() => {
          setMiniDetailsIsOpen(false);
        }}
      ></ReproMiniDetailsModal>
    </Fragment>
  );
};
export default TransactionsModal;
