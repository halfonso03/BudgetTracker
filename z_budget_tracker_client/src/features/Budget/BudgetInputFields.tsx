import { useState } from 'react';
import NumericArrayInput from '../../components/NumericArrayInput';
import type { UseFormRegisterReturn } from 'react-hook-form';
import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
} from '../../app/util';
import {
  AlertTriangle,
  ArrowLeftRight,
  DollarSign,
  Pencil,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CommentsModal from './modals/CommentsModal';

interface Props {
  isLastRow: boolean;
  year: number;
  initiativeId: number;
  grantId: number;
  categoryId: number;
  accountId: number;
  comment?: BudgetComment;
  fieldName: string;
  budgetedAmount: string;
  currentAmount: string;
  spentAmount: string;
  hasRepro: boolean;
  amountRegister: UseFormRegisterReturn<`rows.${number}.amount`>;
  remainingAmountRegister?: UseFormRegisterReturn<`rows.${number}.remaining_amount`>;
  currentAmountRegister?: UseFormRegisterReturn<`rows.${number}.current_amount`>;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    isDirty: boolean,
    newRemaining: number,
  ) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onShowAccountHistory?: (
    budgetType: number,
    initiativeId: number,
    grantId: number,
    accountId: number,
    category: string,
  ) => void;
}
const BudgetInputFields = ({
  fieldName,
  accountId,
  hasRepro,
  year,
  initiativeId,
  grantId,
  categoryId,
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
  currentAmountRegister,
  onShowAccountHistory,
}: Props) => {
  const navigate = useNavigate();
  let reprogrammed =
    parseFormattedNumber(currentAmount) - parseFormattedNumber(budgetedAmount);

  reprogrammed = isNaN(reprogrammed) ? 0 : reprogrammed;

  const [error, setError] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<string>(() =>
    formatNumber(
      parseFormattedNumber(currentAmount) + parseFormattedNumber(spentAmount),
    ),
  );

  const [animateOut, setAnimateOut] = useState<boolean>(false);

  const [current, setCurrent] = useState<string>(
    formatNumber(parseFormattedNumber(currentAmount)),
  );
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);

  function onOpenComments() {
    setCommentsOpen(true);
  }

  function getCellColor(isLastRow: boolean, amount: string) {
    if (isLastRow) return 'bg-neutral-100 font-bold text-neutral-600 ';
    if (isNaN(parseFormattedNumber(amount))) return 'text-neutral-400';
    if (parseFormattedNumber(amount) === 0) return 'text-neutral-400';
  }

  function showAccountHistory(
    budgetType: number,
    initiativeId: number,
    grantId: number,
    accountId: number,
    category: string,
  ) {
    onShowAccountHistory?.(
      budgetType,
      initiativeId,
      grantId,
      accountId,
      category,
    );
  }

  return (
    <>
      <div
        className={`self-center pl-3 ${isLastRow ? 'py-2 bg-neutral-100 font-bold text-neutral-600' : ''}`}
      >
        {fieldName}
      </div>
      <div
        className={`text-end self-center py-2  ${isLastRow ? ' py-2 bg-neutral-100' : ''}`}
      >
        <NumericArrayInput
          key={accountId}
          register={amountRegister}
          readOnly={isLastRow}
          disabled={isLastRow}
          className={`${isLastRow ? ' border-0 p-0 m-0 font-bold text-neutral-600 pr-1 ' : 'p-[.2rem] border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
          onClick={(e) => (onClick ? onClick(e) : null)}
          onBlur={(e) => {
            if (onBlur) {
              const budgeted = parseFormattedNumber(e.target.value);
              const spentParsed = parseFormattedNumber(spentAmount);

              if (budgeted + reprogrammed !== 0) {
                setCurrent(formatNumber(budgeted + reprogrammed));
              } else setCurrent('-');

              const newRemaining = formatNumber(
                budgeted + reprogrammed + spentParsed,
              );

              console.log(budgeted);
              console.log(reprogrammed);
              console.log(spentParsed);
              console.log(newRemaining);

              setRemaining(newRemaining);
              setError(budgeted + reprogrammed + spentParsed < 0);
              onBlur(
                e,
                budgeted !== parseFormattedNumber(budgetedAmount),
                budgeted + reprogrammed + spentParsed,
              );
            }
          }}
          onFocus={(e) => (onFocus ? onFocus(e) : null)}
        ></NumericArrayInput>
      </div>
      <div
        className={`text-end self-center py-1 ${getCellColor(isLastRow, current)} ${isLastRow} ? " py-2 ":""`}
      >
        {!isLastRow ? (
          <>
            <span>
              {!hasRepro ? (
                parseFormattedNumber(current) == 0 ? (
                  '- '
                ) : (
                  current
                )
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() =>
                    showAccountHistory(
                      2,
                      initiativeId,
                      grantId,
                      accountId,
                      fieldName,
                    )
                  }
                  className=" hover:underline underline-offset-5 text-blue-600 cursor-pointer"
                >
                  {current}
                </button>
              )}
            </span>
          </>
        ) : (
          <div>
            {parseFormattedNumber(currentAmount) > 0 ? (
              <input
                type="text"
                {...currentAmountRegister}
                readOnly={true}
                tabIndex={-1}
                disabled={true}
                className="text-end w-full"
              />
            ) : (
              '-'
            )}
          </div>
        )}
      </div>
      <div
        className={`text-end self-center py-1  ${getCellColor(isLastRow, spentAmount)} ${isLastRow} ? " py-2 ": ""`}
      >
        {parseFormattedNumber(spentAmount) !== 0 && !isLastRow ? (
          <button type="button" tabIndex={-1}>
            {formatCurrency(parseFormattedNumber(spentAmount))}
          </button>
        ) : parseFormattedNumber(spentAmount) === 0 ? (
          '-'
        ) : (
          <div className="">
            {formatCurrency(parseFormattedNumber(spentAmount))}
          </div>
        )}
      </div>
      <div
        className={`flex justify-end self-center py-1 ${isLastRow ? ' py-2 bg-neutral-100 font-bold text-neutral-600' : ''} `}
      >
        {!isLastRow && (error || parseFormattedNumber(remaining) < 0) && (
          <div className="mr-2 relative">
            <AlertTriangle className="absolute ml-1 text-red-500 bottom-0 right-1"></AlertTriangle>
          </div>
        )}
        {!isLastRow ? (
          parseFormattedNumber(remaining) == 0 ? (
            <span className="text-neutral-400 pr-1">-</span>
          ) : (
            <div
              onClick={() =>
                showAccountHistory(
                  3,
                  initiativeId,
                  grantId,
                  accountId,
                  fieldName,
                )
              }
              className={`text-blue-600 hover:underline underline-offset-5 cursor-pointer`}
            >
              {formatCurrency(parseFormattedNumber(remaining))}
            </div>
          )
        ) : (
          <>
            <input
              {...remainingAmountRegister}
              readOnly={true}
              tabIndex={-1}
              disabled={true}
              className="text-end w-full"
            ></input>
          </>
        )}
      </div>
      <div
        className={`text-center self-center py-1 text-blue-500 text-sm  ${isLastRow ? 'py-2 bg-neutral-100 self-stretch' : ' self-center '}`}
      >
        {!isLastRow ? (
          <button
            type="button"
            className={`cursor-pointer ${isLastRow ? 'opacity-0' : ''}`}
            disabled={isLastRow}
            tabIndex={-1}
            onClick={() => onOpenComments()}
          >
            <Pencil
              size={comment?.text ? 24 : 22}
              className={`hover:scale-120 transition-all duration-200 ${comment?.text ? 'text-blue-400' : 'text-neutral-400/60 '}`}
            ></Pencil>
          </button>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
      <div
        className={`flex py-1 justify-around cursor-pointer text-blue-500 self-center ${isLastRow ? 'bg-neutral-100' : ''}`}
      >
        {!isLastRow && parseFormattedNumber(remaining) > 0 ? (
          <>
            <Link
              to={`/reprogramming/${year}/${initiativeId}/${grantId}/${categoryId}/${accountId}`}
              tabIndex={-1}
            >
              <ArrowLeftRight></ArrowLeftRight>
            </Link>

            <DollarSign
              onClick={() => {
                navigate(
                  `/payments//${year}/${initiativeId}/${grantId}/${categoryId}/${accountId}`,
                );
              }}
            ></DollarSign>
          </>
        ) : (
          <div className={`${isLastRow && 'py-1'}`}>&nbsp;</div>
        )}
      </div>
      <CommentsModal
        isOpen={commentsOpen}
        animateOut={animateOut}
        initiativeId={initiativeId}
        grantId={grantId}
        accountId={accountId}
        accountName={fieldName}
        onCommentSaved={() => {
          setAnimateOut(true);
          setTimeout(() => {
            setCommentsOpen(false);
            setAnimateOut(false);
          }, 1200);
        }}
        onCancelForm={() => {
          setAnimateOut(true);
          setTimeout(() => {
            setCommentsOpen(false);
            setAnimateOut(false);
          }, 400);
        }}
        comment={comment}
      ></CommentsModal>
    </>
  );
};
export default BudgetInputFields;
