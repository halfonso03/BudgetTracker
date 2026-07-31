import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { formatNumber, parseFormattedNumber } from '../../app/util';
import CommentsModal from './CommentsModal';
import Menus from '../../components/menus/Menus';
import { useNavigate } from 'react-router-dom';

interface Props {
  isLastRow: boolean;
  initiativeId: number;
  grantId: number;
  accountId: number;
  comment: string;
  fieldName: string;
  budgetedAmount: string;
  spentAmount: number;
  amountRegister: UseFormRegisterReturn<`rows.${number}.amount`>;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}
const BudgetRow = ({
  fieldName,
  accountId,
  initiativeId,
  grantId,
  comment,
  budgetedAmount,
  spentAmount,
  isLastRow,
  onClick,
  onBlur,
  onFocus,
  amountRegister,
}: Props) => {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState<string>(() =>
    formatNumber(parseFormattedNumber(budgetedAmount) - spentAmount),
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
        className={`text-start pl-3 py-2  ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {fieldName}
      </div>
      <div className={`text-end py-2  ${isLastRow ? 'bg-neutral-100' : ''}`}>
        <NumericArrayInput
          key={accountId}
          register={amountRegister}
          readOnly={isLastRow}
          disabled={isLastRow}
          className={`${isLastRow ? 'border-0 font-bold text-neutral-600' : 'border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
          onClick={onClick}
          onBlur={(e) => {
            const budgeted = parseFormattedNumber(e.target.value);
            setRemaining(formatNumber(budgeted - spentAmount));
            onBlur(e);
          }}
          onFocus={onFocus}
        ></NumericArrayInput>
      </div>
      <div
        className={`text-end py-2  ${isLastRow ? 'bg-neutral-100  font-bold text-neutral-600' : ''}`}
      >
        {spentAmount}
      </div>
      <div
        className={`text-end py-2  ${isLastRow ? 'bg-neutral-100  font-bold text-neutral-600' : ''}`}
      >
        {remaining}
      </div>
      <div
        className={`text-end  text-blue-500 text-sm self-center ${isLastRow ? 'bg-neutral-100 p-3' : ' p-0'}`}
      >
        <button
          type="button"
          className={`cursor-pointer ${isLastRow ? 'opacity-0' : ''}`}
          disabled={isLastRow}
          tabIndex={-1}
          onClick={() => onOpenComments()}
        >
          0 Comments
        </button>
      </div>
      <div
        className={`flex justify-center p-3 text-blue-500 text-sm self-center ${isLastRow ? 'bg-neutral-100' : ''}`}
      >
        {!isLastRow && (
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
        )}
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
export default BudgetRow;
