import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import CommentsModalNewBudget from './modals/CommentsModalNewBudget';
import { Pencil } from 'lucide-react';

interface Props {
  isLastRow: boolean;
  initiativeId: number;
  grantId: number;
  accountId: number;
  fieldName: string;
  comment?: BudgetComment;
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
  comment,
  onClick,
  onBlur,
  onFocus,
  amountRegister,
  onCommentSaved,
}: Props) => {
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [hasComment, setHasComment] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);

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
        className={` self-center pl-3 ${isLastRow ? 'dark:text-slate-300 py-2 bg-neutral-100 dark:bg-slate-800/80 font-bold text-neutral-600  ' : 'dark:text-white'}`}
      >
        {fieldName}
      </div>
      <div
        className={`text-end self-center py-2 ${isLastRow ? ' py-2 bg-neutral-100 dark:bg-slate-800/80 ' : ''}`}
      >
        <NumericArrayInput
          key={accountId}
          register={amountRegister}
          readOnly={isLastRow}
          disabled={isLastRow}
          className={` ${isLastRow ? ' border-0 p-0 m-0 font-bold text-neutral-600 pr-1 dark:text-slate-300  ' : 'p-[.2rem] border border-neutral-200 dark:border-slate-700/80 dark:text-white dark:focus:border-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
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
        className={`text-center self-center py-2 text-blue-500 text-sm  ${isLastRow ? 'bg-neutral-100 self-stretch dark:bg-slate-800/80' : ' self-center '}`}
      >
        {!isLastRow ? (
          <>
            {/* <button
              type="button"
              className={`cursor-pointer dark:text-indigo-400 ${isLastRow ? 'opacity-0' : ''}`}
              disabled={isLastRow}
              tabIndex={-1}
              onClick={() => setCommentsOpen(true)}
            >
              {hasComment ? 1 : 0} Comment
            </button> */}
            <button
              type="button"
              className={`cursor-pointer ${isLastRow ? 'opacity-0' : ''}`}
              disabled={isLastRow}
              tabIndex={-1}
              onClick={() => setCommentsOpen(true)}
            >
              <Pencil
                // size={comment?.text ? 24 : 22}
                className={`hover:scale-120  transition-all duration-200 ${hasComment ? 'text-blue-400 dark:text-indigo-500' : 'text-neutral-400/60 '}`}
              ></Pencil>
            </button>
            {comment?.text}
          </>
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
