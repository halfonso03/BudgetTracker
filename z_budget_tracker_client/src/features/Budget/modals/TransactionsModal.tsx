import useTransactions from '../../../api/hooks/budgets/useTransactions';
import { formatCurrency, formatDate, formatNumber } from '../../../app/util';
import Modal2 from '../../../components/Modal2';
import { Fragment, useState } from 'react';
import Button from '../../../components/Button';
import Label from '../../../components/Label';

type Props = {
  budgetType: number;
  initiativeId: number;
  grantId: number;
  accountId: number;
  accountName: string;
  isOpen: boolean;
  onCancel: () => void;
  onSelectedId: (
    itemType: ItemyType,
    id: number,
    accountName: string,
    initiativeId: number,
    grantId: number,
    accountId: number,
  ) => void;
};

const TransactionsModal = (props: Props) => {
  const { data, isLoading } = useTransactions(
    props.budgetType,
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
        <div >
          <Label>ACCOUNT</Label>
          <div className="font-semibold self-end mb-3 dark:text-white">
            {props.accountName}
          </div>
          <div className="grid grid-cols-[1.6fr_1.5fr_1fr_1fr] gap-2 my-3 border-b border-b-neutral-200 dark:border-b-slate-700">
            <div></div>
            <div className="text-center">
              <Label>POSTED DATE</Label>
            </div>
            <div className="text-end">
              <Label>AMOUNT</Label>
            </div>
            <div className="text-end">
              <Label>BALANCE</Label>
            </div>
          </div>
          {data?.map((t, i) => {
            if (i > 0) remaining += data[i].amount;
            return (
              <div
                className="cursor-pointer grid grid-cols-[1.6fr_1.5fr_1fr_1fr] gap-2 p-2 hover:bg-neutral-200/50 rounded-md dark:hover:bg-slate-700/60 duration-200 transition-all"
                key={i}
                onClick={() => {
                  if (t.typeName === 'Reprogramming') {
                    props.onSelectedId(
                      'r',
                      t.id,
                      props.accountName,
                      props.initiativeId,
                      props.grantId,
                      props.accountId,
                    );
                  }
                  if (t.payeeName) {
                    props.onSelectedId(
                      'd',
                      t.id,
                      t.payeeName,
                      props.initiativeId,
                      props.grantId,
                      props.accountId,
                    );
                  }
                }}
              >
                <div className="flex justify-between gap-2 ">
                  <div className="font-medium dark:text-white">
                    {t.typeName}{' '}
                    {t.typeName === 'Reprogramming' && (
                      <span>- &nbsp;{t.id}</span>
                    )}
                  </div>
                  <div>
                    {/* {t.typeName == 'Reprogramming' ? (
                      <button
                        className="cursor-pointer underline underline-offset-3 text-blue-600"
                        onClick={() => {}}
                      >
                        {t.id}
                      </button>
                    ) : null}
                    {t.payeeName ? (
                      <button
                        className="cursor-pointer underline underline-offset-3 text-blue-600"
                        onClick={() => {
                          props.onSelectedId(
                            'd',
                            t.id,
                            t.payeeName,
                            props.initiativeId,
                            props.grantId,
                            props.accountId,
                          );
                        }}
                      >
                        {t.id}
                      </button>
                    ) : null} */}
                  </div>
                </div>
                <div className="text-center font-medium text-neutral-700 dark:text-slate-100">
                  {formatDate(t.postedDate)}
                </div>
                <div className="text-end font-medium text-neutral-700 dark:text-slate-100">
                  {formatCurrency(t.amount)}
                </div>
                <div className="text-neutral-700 font-medium text-end dark:text-slate-100">
                  {formatNumber(remaining)}
                </div>
              </div>
            );
          })}
          <div className="flex justify-end mt-4 pt-4  border-t border-t-neutral-200 dark:border-t-slate-700/60">
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
