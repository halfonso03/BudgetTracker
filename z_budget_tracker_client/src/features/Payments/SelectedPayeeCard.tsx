import { Info, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../app/util';

type Props = {
  selectedPayee: Payee | null;
  selectedPayeeInfo: Payee;
  onRemoveSelection: () => void;
  onOpenInfoWindow: () => void;
};

const SelectedPayeeCard = ({
  onOpenInfoWindow,
  onRemoveSelection,
  selectedPayee,
  selectedPayeeInfo,
}: Props) => {
  return (
    <div>
      {selectedPayee && (
        <div className="flex items-center shadow-md gap-1 bg-neutral-200/70 rounded-sm border border-neutral-200/90">
          <div
            className="cursor-pointer p-2 text-neutral-600 self-stretch hover:text-neutral-900 hover:bg-neutral-100"
            onClick={onRemoveSelection}
          >
            <X size={16}></X>
          </div>
          <div className="flex-1 p-1">
            <div className="text-neutral-700 font-medium">
              <div className="flex justify-between font-semibold tracking-wider">
                {selectedPayee?.name}
                <div
                  className="text-neutral-500 cursor-pointer "
                  onClick={onOpenInfoWindow}
                >
                  <Info size={18}></Info>
                </div>
              </div>
            </div>
            <div className="text-neutral-500 text-[.95rem]">
              [Payee Type:{' '}
              <span className="text-neutral-700">
                {selectedPayee?.payeeTypeId === 1 ? 'Vendor' : 'Contractor'}]
              </span>
              <br></br>
              [Charge Account:{' '}
              <span className="text-neutral-700">
                {selectedPayee.categoryName + ' - ' + selectedPayee.accountName}
              </span>
              ]<br></br>
              {selectedPayeeInfo?.lastPaymentDate && (
                <>
                  [Last Payment:{' '}
                  <span className="text-neutral-700">
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
                  ]<br></br>
                  [No. of Payments: <span className="text-neutral-700">45</span>
                  ]
                </>
              )}
              {!selectedPayeeInfo?.lastPaymentDate && (
                <div className="italic">
                  No payments have been made to this payee
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
