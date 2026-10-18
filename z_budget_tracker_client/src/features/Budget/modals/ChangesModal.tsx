import { useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import useBudgetAudit from '../../../api/hooks/budgets/useBudgetAudit';
import Spinner from '../../../components/Spinner';
import { formatCurrency } from '../../../app/util';
import { formatDate } from 'date-fns';
import {
  BUDGET_AUDIT_INITIAL_VERSION,
  BUDGET_AUDIT_NEW_VERSION,
  BUDGET_AUDIT_OLD_VERSION,
} from '../../../app/constants';

type Props = {
  initiativeId: number;
  grantId: number;
  isOpen: boolean;
  initiativeName: string;
  grantName: string;
  onCancel: () => void;
};

const ChangeModal = ({
  initiativeId,
  grantId,
  initiativeName,
  grantName,
  ...props
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);
  const { data: audits, isLoading: loadingAudits } = useBudgetAudit(
    initiativeId,
    grantId,
  );

  if (loadingAudits)
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );

  if (audits?.length === 0)
    return (
      <div className="font-semibold text-neutral-600">
        There are no audits records for this budget.
      </div>
    );

  return (
    <Modal2
      size="lg"
      title={`Budget Audit | ${initiativeName} - ${grantName}`}
      animateOut={animateOut}
      {...props}
    >
      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] font-medium p-2 px-3 bg-neutral-200/50 text-neutral-500 border border-neutral-300/60 rounded-t-sm">
        <div>Version</div>
        <div>Acount</div>
        <div className="text-center">New Amount</div>
        <div className="text-center">Updated By</div>
        <div className="text-center">Update Date</div>
      </div>
      <div className="border-l border-r border-b border-neutral-300/60 mb-4 h-[65dvh] overflow-y-scroll">
        {audits?.map((a, index) => {
          console.log('  a.version', a.version);
          const classes =
            a.version === BUDGET_AUDIT_INITIAL_VERSION
              ? 'border-blue-500'
              : a.version == BUDGET_AUDIT_NEW_VERSION
                ? 'border-green-500'
                : a.version == BUDGET_AUDIT_OLD_VERSION
                  ? 'border-red-500'
                  : 'border-neutral-300';
          return (
            <div key={index} className={`  last:border-0 mt-1  p-1`}>
              <div
                className={`hover:bg-neutral-100/60 grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] border p-2 px-3 ${classes}`}
              >
                <div className='font-medium'>{a.accountName}</div>
                <div>{a.version}</div>
                <div className="text-center">{formatCurrency(a.amount)}</div>
                <div className="text-center">{a.updatedBy}</div>
                <div className="text-center">
                  {formatDate(a.updateDate, 'M/d/yy h:mm a')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end gap-3 pb-3">
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
    </Modal2>
  );
};
export default ChangeModal;
