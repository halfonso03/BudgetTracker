import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import CommentsModalNewBudget from './CommentsModalNewBudget';

interface Props {
  isLastRow: boolean;
  initiativeId: number;
  grantId: number;
  accountId: number;
  fieldName: string;
  budgetedAmount: string;
  amountRegister: UseFormRegisterReturn<`rows.${number}.amount`>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onCommentSaved?: (e: { accountId: number; text: string }) => void;
}
const BudgetInputFieldsNewBudget = ({
  fieldName,
  accountId,
  isLastRow,
  onClick,
  onBlur,
  onFocus,
  amountRegister,
  onCommentSaved,
}: Props) => {
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [hasComment, setHasComment] = useState<boolean>(false);

  function handleSaveComments(e: { accountId: number; text: string }) {
    try {
      setHasComment(e.text.trim() != '' && e.text !== null);
      onCommentSaved?.(e);
    } catch (error) {
      console.log('error', error);
    }
  }

  function closeModal() {
    setAnimateOut(true);
    setTimeout(() => {
      setCommentsOpen(false);
      setAnimateOut(false);
    }, 450);
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
            onClick={() => setCommentsOpen(true)}
          >
            {hasComment ? 1 : 0} Comment
          </button>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>

      <CommentsModalNewBudget
        isOpen={commentsOpen}
        animateOut={animateOut}
        accountId={accountId}
        accountName={fieldName}
        onCommentSaved={(e) => {
          handleSaveComments(e);
          closeModal();
        }}
        onCancelForm={closeModal}
      ></CommentsModalNewBudget>
    </>
  );
};
export default BudgetInputFieldsNewBudget;
