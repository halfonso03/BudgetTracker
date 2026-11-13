import { Info, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../app/util';

type Props = {
  selectedPayeeInfo: Payee;
  onRemoveSelection: () => void;
  onOpenInfoWindow: () => void;
};

const SelectedPayeeCard = ({
  onOpenInfoWindow,
  onRemoveSelection,
  selectedPayeeInfo,
}: Props) => {
  return (
    <div>
      {selectedPayeeInfo && (
        <div className="flex  items-center shadow-md  bg-neutral-200/70 dark:bg-slate-700/80 rounded-sm border border-neutral-200/90 dark:border-slate-700">
          <div
            className="cursor-pointer p-2 text-neutral-600 dark:text-slate-200 self-stretch hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-500"
            onClick={onRemoveSelection}
          >
            <X size={16}></X>
          </div>
          <div className="flex-1 p-1">
            <div className="text-neutral-700 dark:text-white font-medium">
              <div className="flex justify-between font-semibold tracking-wider">
                {selectedPayeeInfo?.name}
                {selectedPayeeInfo?.lastPaymentDate && (
                  <div
                    className="text-neutral-500 dark:text-white cursor-pointer "
                    onClick={onOpenInfoWindow}
                  >
                    <Info size={18}></Info>
                  </div>
                )}
              </div>
            </div>
            <div className="text-neutral-500 dark:text-slate-300 text-[.95rem]">
              [Payee Type:{' '}
              <span className="text-neutral-700 dark:text-white">
                {selectedPayeeInfo?.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}
              </span>
              ]<br />
              {selectedPayeeInfo?.lastPaymentDate && (
                <>
                  [Last Payment:{' '}
                  <span className="text-neutral-700 dark:text-white">
                    {selectedPayeeInfo &&
                      selectedPayeeInfo?.lastPaymentDate && (
                        <span>
                          {selectedPayeeInfo && (
                            <>
                              <span>
                                {formatDate(selectedPayeeInfo?.lastPaymentDate)}
                              </span>
                              <span className="ml-2">
                                {selectedPayeeInfo?.lastPaymentAmount &&
                                  '$' +
                                    formatCurrency(
                                      selectedPayeeInfo?.lastPaymentAmount,
                                    )}
                              </span>
                            </>
                          )}
                        </span>
                      )}
                  </span>
                  ] [No. of Payments:{' '}
                  <span className="text-neutral-700 dark:text-white">
                    {selectedPayeeInfo.numberOfPayments}
                  </span>
                  ]
                </>
              )}
              {!selectedPayeeInfo?.lastPaymentDate && (
                <div className="italic">
                  No payments have been posted for this payee
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SelectedPayeeCard;
