import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { formatNumber, parseFormattedNumber } from '../../app/util';
import CommentsModal from './CommentsModal';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isLastRow: boolean;
  initiativeId: number;
  grantId: number;
  accountId: number;
  comment: string;
  fieldName: string;
  budgetedAmount: string;
  currentAmount: string;
  spentAmount: string;
  amountRegister: UseFormRegisterReturn<`rows.${number}.amount`>;
  remainingAmountRegister: UseFormRegisterReturn<`rows.${number}.remaining_amount`>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
const BudgetInputFields = ({
  fieldName,
  accountId,
  initiativeId,
  grantId,
  comment,
  budgetedAmount,
  currentAmount,
  spentAmount,
  isLastRow,
  onClick,
  onBlur,
  onFocus,
  amountRegister,
  remainingAmountRegister,
}: Props) => {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState<string>(() =>
    formatNumber(
      parseFormattedNumber(budgetedAmount) - parseFormattedNumber(spentAmount),
    ),
  );
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);

  function onOpenComments() {
    setCommentsOpen(true);
  }

  function handleSaveComments() {
    try {
      console.log('13', 13);
    } catch (error) {
      console.log(error);
    } finally {
      setCommentsOpen(false);
    }
  }

  return (
    <>
      <div
        className={`self-center pl-3 py-2 ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {fieldName}
      </div>
      <div
        className={`text-end self-center py-2  ${isLastRow ? 'bg-neutral-100' : ''}`}
      >
        <NumericArrayInput
          key={accountId}
          register={amountRegister}
          readOnly={isLastRow}
          disabled={isLastRow}
          className={`${isLastRow ? 'border-0 p-0 m-0 font-bold text-neutral-600 pr-1 ' : 'p-[.2rem] border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
          onClick={(e) => (onClick ? onClick(e) : null)}
          onBlur={(e) => {
            if (onBlur) {
              // const budgeted = parseFormattedNumber(e.target.value);
              const current = parseFormattedNumber(currentAmount);
              const spent = parseFormattedNumber(spentAmount);
              setRemaining(formatNumber(current - spent));
              onBlur(e);
            }
          }}
          onFocus={(e) => (onFocus ? onFocus(e) : null)}
        ></NumericArrayInput>
      </div>
      <div
        className={`text-end self-center py-2  ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {currentAmount}
        {/* {currentAmount ? currentAmount : 0} */}
      </div>
      <div
        className={`text-end self-center py-2  ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {spentAmount}
      </div>
      <div
        className={`text-end self-center py-2 ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {!isLastRow ? (
          remaining
        ) : (
          <input
            {...remainingAmountRegister}
            readOnly={true}
            tabIndex={-1}
            disabled={true}
            className="text-end w-full"
          ></input>
        )}
      </div>
      <div
        className={`text-center self-center py-2 text-blue-500 text-sm  ${isLastRow ? 'bg-neutral-100 self-stretch' : ' self-center '}`}
      >
        {!isLastRow ? (
          <button
            type="button"
            className={`cursor-pointer ${isLastRow ? 'opacity-0' : ''}`}
            disabled={isLastRow}
            tabIndex={-1}
            onClick={() => onOpenComments()}
          >
            0 Comments
          </button>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
      <div
        className={`flex py-2 justify-around cursor-pointer text-blue-500 self-center ${isLastRow ? 'bg-neutral-100' : ''}`}
      >
        {!isLastRow ? (
          <>
            <ArrowLeftRight
              onClick={() => {
                navigate(
                  `/reprogramming/create/${initiativeId}/${grantId}/${accountId}`,
                );
              }}
            ></ArrowLeftRight>
            <DollarSign
              onClick={() => {
                navigate(
                  `/disbusersement/create/${initiativeId}/${grantId}/${accountId}`,
                );
              }}
            ></DollarSign>
          </>
        ) : (
          <div>&nbsp;</div>
        )}
        {/* {!isLastRow ? (
          <Menus>
            <Menus.Toggler id={accountId.toString()}>Actions</Menus.Toggler>
            <Menus.List id={accountId.toString()}>
              <Menus.MenuItem
                onClick={() => {
                  navigate(
                    `/reprogramming/create/${initiativeId}/${grantId}/${accountId}`,
                  );
                }}
              >
                <span className="text-[.95rem] text-neutral-800">
                  Reprogram Funds
                </span>
              </Menus.MenuItem>
              <Menus.MenuItem
                onClick={() => {
                  navigate(
                    `/disbusersement/create/${initiativeId}/${grantId}/${accountId}`,
                  );
                }}
              >
                <span className="text-[.95rem] text-neutral-800">
                  Disburse Funds
                </span>
              </Menus.MenuItem>
            </Menus.List>
          </Menus>
        ) : ( */}
      </div>
      {commentsOpen && (
        <CommentsModal
          initiativeId={initiativeId}
          grantId={grantId}
          accountId={accountId}
          accountName={fieldName}
          onSaveComments={handleSaveComments}
          onCancelForm={() => {
            setCommentsOpen(false);
          }}
          currentComments={comment}
        ></CommentsModal>
      )}
    </>
  );
};
export default BudgetInputFields;
