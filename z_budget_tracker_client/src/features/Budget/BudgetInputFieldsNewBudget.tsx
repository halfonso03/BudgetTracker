import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import CommentsModal from './CommentsModal';

interface Props {
  isLastRow: boolean;
  initiativeId: number;
  grantId: number;
  accountId: number;
  comment: string;
  fieldName: string;
  budgetedAmount: string;
  amountRegister: UseFormRegisterReturn<`rows.${number}.amount`>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
const BudgetInputFieldsNewBudget = ({
  fieldName,
  accountId,
  initiativeId,
  grantId,
  comment,
  isLastRow,
  onClick,
  onBlur,
  onFocus,
  amountRegister,
}: Props) => {
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
        className={`self-center pl-3 py-2 ${isLastRow ? 'bg-neutral-100 font-bold text-neutral-700' : ''}`}
      >
        {fieldName}
      </div>
      <div
        className={`text-end self-center py-1  ${isLastRow ? 'bg-neutral-100' : ''}`}
      >
        <NumericArrayInput
          key={accountId}
          register={amountRegister}
          readOnly={isLastRow}
          disabled={isLastRow}
          className={`${isLastRow ? 'border-0 p-0 m-0 font-bold text-neutral-600 pr-1 py-1 ' : 'p-[.2rem] border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
          onClick={(e) => (onClick ? onClick(e) : null)}
          onBlur={(e) => {
            if (onBlur) {
              // const budgeted = parseFormattedNumber(e.target.value);
              onBlur(e);
            }
          }}
          onFocus={(e) => (onFocus ? onFocus(e) : null)}
        ></NumericArrayInput>
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
export default BudgetInputFieldsNewBudget;
